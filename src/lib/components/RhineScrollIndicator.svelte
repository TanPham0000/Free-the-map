<script lang="ts">
	import { onMount } from 'svelte';

	let scrollProgress = $state(0);
	let pathElement: SVGPathElement;
	let pathLength = $state(0);

	function calculateScrollProgress() {
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;
		const scrollTop = window.scrollY;
		
		// Calculate progress from 0 to 1
		const maxScroll = documentHeight - windowHeight;
		scrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
	}

	function updatePath() {
		if (pathElement) {
			pathLength = pathElement.getTotalLength();
		}
	}

	function handleScroll() {
		calculateScrollProgress();
	}

	function handleResize() {
		calculateScrollProgress();
		updatePath();
	}

	onMount(() => {
		calculateScrollProgress();
		updatePath();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleResize);
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		};
	});

	// Calculate dash offset to show progress
	let dashOffset = $derived(pathLength * (1 - scrollProgress));
</script>

<div class="scroll-indicator">
	<svg
		class="rhine-path"
		viewBox="0 0 100 810"
		preserveAspectRatio="xMidYMid meet"
	>
		<!-- Background path (full river, dimmed) -->
		<path
			d="M 50 30 
			   C 48 80, 42 130, 38 180
			   C 35 230, 40 280, 45 330
			   C 50 380, 48 430, 42 480
			   C 38 530, 45 580, 50 630
			   C 52 680, 48 730, 50 780"
			fill="none"
			stroke="rgba(173, 216, 230, 0.2)"
			stroke-width="2"
			stroke-linecap="round"
		/>
		
		<!-- Progress path (filled portion) -->
		<path
			bind:this={pathElement}
			d="M 50 30 
			   C 48 80, 42 130, 38 180
			   C 35 230, 40 280, 45 330
			   C 50 380, 48 430, 42 480
			   C 38 530, 45 580, 50 630
			   C 52 680, 48 730, 50 780"
			fill="none"
			stroke="rgba(173, 216, 230, 0.9)"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-dasharray={pathLength}
			stroke-dashoffset={dashOffset}
			style="filter: drop-shadow(0 0 4px rgba(173, 216, 230, 0.6));"
		/>
		
		<!-- Progress dot at current position -->
		<circle
			cx="50"
			cy={30 + scrollProgress * 750}
			r="4"
			fill="#ffffff"
			style="filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8)); transition: cy 0.1s ease-out;"
		/>
	</svg>
</div>

<style>
	.scroll-indicator {
		position: fixed;
		right: 2rem;
		top: 50%;
		transform: translateY(-50%);
		width: 60px;
		height: 80vh;
		max-height: 600px;
		z-index: 1000;
		pointer-events: none;
		opacity: 0.8;
	}

	.rhine-path {
		width: 100%;
		height: 100%;
	}

	/* Responsive: hide on mobile */
	@media (max-width: 768px) {
		.scroll-indicator {
			display: none;
		}
	}
</style>
