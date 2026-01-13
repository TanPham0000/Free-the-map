<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let cursorRef: HTMLDivElement;
	let canvasRef: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	let mouseX = 0;
	let mouseY = 0;
	let cursorX = 0;
	let cursorY = 0;
	let isHovering = false;
	let cursorSize = 10; // base size in pixels
	let hoverSize = cursorSize * 1.5; // 0.5% bigger

	interface WaterDrop {
		x: number;
		y: number;
		vx: number;
		vy: number;
		length: number;
		opacity: number;
		lifetime: number;
		maxLifetime: number;
	}

	let waterDrops: WaterDrop[] = [];
	let animationFrame: number;

	// Smooth cursor following
	const lerp = (start: number, end: number, factor: number) => {
		return start + (end - start) * factor;
	};

	const updateCursor = () => {
		cursorX = lerp(cursorX, mouseX, 0.15);
		cursorY = lerp(cursorY, mouseY, 0.15);
	};

	const createWaterDrop = () => {
		// Create drops in a ring around the cursor
		const angle = Math.random() * Math.PI * 2;
		const distance = cursorSize + 20 + Math.random() * 30;
		const x = cursorX + Math.cos(angle) * distance;
		const y = cursorY + Math.sin(angle) * distance;

		waterDrops.push({
			x,
			y,
			vx: (Math.random() - 0.5) * 0.5,
			vy: 1 + Math.random() * 2,
			length: (10 + Math.random() * 20) * 0.8, // 20% shorter
			opacity: 0.6 + Math.random() * 0.4,
			lifetime: 0,
			maxLifetime: 60 + Math.random() * 40
		});
	};
	
	let lastMouseX = 0;
	let lastMouseY = 0;
	let mouseVelocityX = 0;
	let mouseVelocityY = 0;

	const updateWaterDrops = () => {
		// Calculate mouse velocity for water movement
		mouseVelocityX = mouseX - lastMouseX;
		mouseVelocityY = mouseY - lastMouseY;
		lastMouseX = mouseX;
		lastMouseY = mouseY;

		// Get current cursor radius
		const currentCursorRadius = (isHovering ? hoverSize : cursorSize) / 2;

		// Update existing drops
		waterDrops = waterDrops
			.map((drop) => {
				// Apply mouse movement influence - water follows mouse movement
				const dx = cursorX - drop.x;
				const dy = cursorY - drop.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const influence = Math.max(0, 1 - distance / 150);

				// Water moves with mouse movement
				if (!isHovering && distance < 80) {
					drop.vx += mouseVelocityX * 0.1 * influence;
					drop.vy += mouseVelocityY * 0.1 * influence;
				}

				// Blow water away when hovering
				if (isHovering) {
					const angle = Math.atan2(dy, dx);
					const blowForce = 0.5 * influence;
					drop.vx += Math.cos(angle) * blowForce;
					drop.vy += Math.sin(angle) * blowForce;
				}

				// Gravity
				drop.vy += 0.08;

				// Friction
				drop.vx *= 0.97;
				drop.vy *= 0.97;

				// Apply velocity
				drop.x += drop.vx;
				drop.y += drop.vy;

				// Check collision with cursor after movement
				const newDx = cursorX - drop.x;
				const newDy = cursorY - drop.y;
				const newDistance = Math.sqrt(newDx * newDx + newDy * newDy);

				if (newDistance < currentCursorRadius && newDistance > 0) {
					// Calculate collision point and normal
					const normalX = newDx / newDistance;
					const normalY = newDy / newDistance;
					
					// Move drop to cursor surface
					drop.x = cursorX - normalX * currentCursorRadius;
					drop.y = cursorY - normalY * currentCursorRadius;
					
					// Calculate velocity magnitude
					const speed = Math.sqrt(drop.vx * drop.vx + drop.vy * drop.vy);
					
					// Calculate tangent direction (perpendicular to normal)
					const tangentX = -normalY;
					const tangentY = normalX;
					
					// Project velocity onto tangent (sliding direction)
					const tangentVelocity = drop.vx * tangentX + drop.vy * tangentY;
					
					// Calculate bounce component (reflection along normal)
					const normalVelocity = drop.vx * normalX + drop.vy * normalY;
					
					// If velocity is high enough, bounce; otherwise just slide
					const bounceThreshold = 100.0;
					if (speed > bounceThreshold && normalVelocity < 0) {
						// Bounce: reflect normal component, keep tangent component
						const bounceFactor = 0.6; // Bounce damping
						drop.vx = tangentX * tangentVelocity - normalX * normalVelocity * bounceFactor;
						drop.vy = tangentY * tangentVelocity - normalY * normalVelocity * bounceFactor;
					} else {
						// Slide: keep tangent component, reduce normal component
						drop.vx = tangentX * tangentVelocity * 0.8;
						drop.vy = tangentY * tangentVelocity * 0.8;
					}
					
					// Add slight push away from cursor
					drop.vx += normalX * 0.3;
					drop.vy += normalY * 0.3;
				}

				drop.lifetime++;

				return drop;
			})
			.filter((drop) => drop.lifetime < drop.maxLifetime);

		// Add new drops if not hovering
		if (!isHovering && waterDrops.length < 25) {
			if (Math.random() < 0.4) {
				createWaterDrop();
			}
		}
	};

	const draw = () => {
		if (!ctx || !canvasRef) return;
		const context = ctx; // Store for type narrowing

		updateWaterDrops();
		updateCursor();

		// Clear canvas
		context.clearRect(0, 0, canvasRef.width, canvasRef.height);

		// Draw water drops as lines (20% wider)
		context.lineWidth = 1.5;
		context.lineJoin = 'round';
		context.lineCap = 'round';
		

		waterDrops.forEach((drop) => {
			const alpha = drop.opacity * (1 - drop.lifetime / drop.maxLifetime);
			context.strokeStyle = `rgba(173, 216, 230, ${alpha})`;
			context.beginPath();
			// Draw line in direction of movement
			const endX = drop.x - drop.vx * drop.length * 0.3;
			const endY = drop.y - drop.vy * drop.length * 0.3;
			context.moveTo(drop.x, drop.y);
			context.lineTo(endX, endY);
			context.stroke();
		});

		animationFrame = requestAnimationFrame(draw);
	};

	const handleMouseMove = (e: MouseEvent) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
		updateCursor();
	};

	const handleMouseEnter = () => {
		isHovering = true;
		// Blow away existing drops
		waterDrops.forEach((drop) => {
			const dx = drop.x - cursorX;
			const dy = drop.y - cursorY;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < 100) {
				const angle = Math.atan2(dy, dx);
				drop.vx += Math.cos(angle) * 5;
				drop.vy += Math.sin(angle) * 5;
			}
		});
	};

	const handleMouseLeave = () => {
		isHovering = false;
	};

	const checkHover = () => {
		const element = document.elementFromPoint(mouseX, mouseY);
		if (element) {
			const isClickable =
				element.tagName === 'A' ||
				element.tagName === 'BUTTON' ||
				element.getAttribute('role') === 'button' ||
				element.closest('a') !== null ||
				element.closest('button') !== null ||
				window.getComputedStyle(element).cursor === 'pointer';

			if (isClickable !== isHovering) {
				if (isClickable) {
					handleMouseEnter();
				} else {
					handleMouseLeave();
				}
			}
		} else if (isHovering) {
			handleMouseLeave();
		}
	};

	onMount(() => {
		if (canvasRef) {
			ctx = canvasRef.getContext('2d');
			canvasRef.width = window.innerWidth;
			canvasRef.height = window.innerHeight;

			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mousemove', checkHover);

			// Also listen for mouseenter/mouseleave on clickable elements
			const handleClickableEnter = () => {
				if (!isHovering) handleMouseEnter();
			};
			const handleClickableLeave = () => {
				if (isHovering) handleMouseLeave();
			};

			// Add listeners to all existing clickable elements
			const addListenersToClickables = () => {
				document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
					el.addEventListener('mouseenter', handleClickableEnter);
					el.addEventListener('mouseleave', handleClickableLeave);
				});
			};

			// Use MutationObserver to handle dynamically added elements
			const observer = new MutationObserver(() => {
				addListenersToClickables();
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true
			});

			addListenersToClickables();

			// Initialize cursor position
			mouseX = window.innerWidth / 2;
			mouseY = window.innerHeight / 2;
			cursorX = mouseX;
			cursorY = mouseY;
			lastMouseX = mouseX;
			lastMouseY = mouseY;

			draw();

			// Handle window resize
			const handleResize = () => {
				if (canvasRef) {
					canvasRef.width = window.innerWidth;
					canvasRef.height = window.innerHeight;
				}
			};
			window.addEventListener('resize', handleResize);

			onDestroy(() => {
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('mousemove', checkHover);
				window.removeEventListener('resize', handleResize);
				observer.disconnect();
				if (animationFrame) {
					cancelAnimationFrame(animationFrame);
				}
			});
		}
	});

	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<canvas bind:this={canvasRef} class="cursor-canvas"></canvas>
<div
	bind:this={cursorRef}
	class="custom-cursor"
	class:hover={isHovering}
	style="left: {cursorX}px; top: {cursorY}px; width: {isHovering ? hoverSize : cursorSize}px; height: {isHovering ? hoverSize : cursorSize}px;"
></div>

<style>
	.cursor-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 9998;
	}

	.custom-cursor {
		position: fixed;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: white;
		pointer-events: none;
		transform: translate(-50%, -50%);
		margin: 10px;
		z-index: 9999;
		transition: width 0.2s ease, height 0.2s ease;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
	}

	.custom-cursor.hover {
		box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
	}

	:global(body) {
		cursor: none !important;
	}

	:global(a),
	:global(button) {
		cursor: none !important;
	}
</style>
