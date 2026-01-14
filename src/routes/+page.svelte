<script lang="ts">
	import { onMount } from 'svelte';

	let introSection: HTMLElement;
	let titleSection: HTMLElement;
	let mountainImage: HTMLElement;
	let cloudSection: HTMLElement;
	let fogSection: HTMLElement;
	let mountainTopSection: HTMLElement;
	let horizontalScrollSection: HTMLElement;
	let scrollContainer: HTMLElement;
	
	let scrollY = $state(0);
	let horizontalScroll = $state(0);

	function handleScroll() {
		scrollY = window.scrollY;
		
		// Calculate horizontal scroll progress for 3D landscape section
		if (horizontalScrollSection) {
			const rect = horizontalScrollSection.getBoundingClientRect();
			const sectionTop = rect.top;
			const sectionHeight = rect.height;
			const viewportHeight = window.innerHeight;
			
			// Start scrolling when section enters viewport
			if (sectionTop < viewportHeight && sectionTop > -sectionHeight) {
				const scrollProgress = Math.max(0, Math.min(1, (viewportHeight - sectionTop) / (viewportHeight + sectionHeight)));
				horizontalScroll = scrollProgress;
			} else if (sectionTop <= -sectionHeight) {
				horizontalScroll = 1;
			} else {
				horizontalScroll = 0;
			}
		}
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Initial call
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<!-- Introduction Section -->
<section class="intro-section" bind:this={introSection}>
	<div class="intro-content">
		<div class="intro-text">
			<p class="intro-description">
				From the pristine mountain peaks where water first flows, 
				to the vast delta where rivers meet the sea. 
				Experience the journey of water through our interconnected world.
			</p>
		</div>
	</div>
</section>

<!-- Title Screen Section with Parallax Mountain -->
<section class="title-section" bind:this={titleSection}>
	<div class="title-content">
		<h1 class="main-title">Free the Map</h1>
		<div class="mountain-container">
			<img 
				bind:this={mountainImage}
				class="mountain-image"
				src="/mountain-cutout.png" 
				alt="Mountain silhouette"
				style="transform: translateY({scrollY * 0.3}px) scale({1 + scrollY * 0.0003});"
			/>
		</div>
		<p class="subtitle">A journey from source to sea</p>
	</div>
</section>

<!-- Cloud Bank Section -->
<section class="cloud-section" bind:this={cloudSection}>
	<div class="cloud-layer cloud-layer-1" style="transform: translateX({scrollY * 0.1}px);"></div>
	<div class="cloud-layer cloud-layer-2" style="transform: translateX({-scrollY * 0.15}px);"></div>
	<div class="cloud-layer cloud-layer-3" style="transform: translateX({scrollY * 0.2}px);"></div>
</section>

<!-- Foggy Sky Section -->
<section class="fog-section" bind:this={fogSection}>
	<div class="fog-layer fog-1" style="opacity: {0.3 + (scrollY % 1000) / 2000}; transform: translateY({scrollY * 0.1}px);"></div>
	<div class="fog-layer fog-2" style="opacity: {0.2 + (scrollY % 800) / 2000}; transform: translateY({-scrollY * 0.08}px);"></div>
	<div class="fog-layer fog-3" style="opacity: {0.25 + (scrollY % 1200) / 2000}; transform: translateY({scrollY * 0.12}px);"></div>
</section>

<!-- Mountain Top Section -->
<section class="mountain-top-section" bind:this={mountainTopSection}>
	<div class="mountain-top-container">
		<div class="mountain-peak" style="transform: translateY({scrollY * 0.2}px);"></div>
		<div class="sky-gradient"></div>
	</div>
</section>

<!-- Horizontal Scroll 3D Landscape Section -->
<section class="horizontal-scroll-section" bind:this={horizontalScrollSection}>
	<div class="scroll-container" bind:this={scrollContainer}>
		<div class="landscape-3d" style="transform: translateX({-horizontalScroll * 200}px) translateZ({horizontalScroll * -100}px) rotateY({horizontalScroll * 5}deg);">
			
			<!-- Labels that come down as you scroll -->
			<div class="label label-1" style="transform: translateY({Math.max(-150, Math.min(0, horizontalScroll * 300 - 150))}px); opacity: {Math.max(0, Math.min(1, (horizontalScroll - 0.3) * 2))};">
				<div class="label-content">
					<h3>Source</h3>
					<p>The beginning</p>
				</div>
			</div>
			
			<div class="label label-2" style="transform: translateY({Math.max(-200, Math.min(0, horizontalScroll * 350 - 200))}px); opacity: {Math.max(0, Math.min(1, (horizontalScroll - 0.4) * 2))};">
				<div class="label-content">
					<h3>Flow</h3>
					<p>The journey</p>
				</div>
			</div>
			
			<div class="label label-3" style="transform: translateY({Math.max(-250, Math.min(0, horizontalScroll * 400 - 250))}px); opacity: {Math.max(0, Math.min(1, (horizontalScroll - 0.5) * 2))};">
				<div class="label-content">
					<h3>Delta</h3>
					<p>The destination</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- River Journey Sections (placeholder for future content) -->
<section class="river-journey">
	<div class="journey-content">
		<!-- This section will be expanded with river journey content -->
	</div>
</section>

<style>
	:global(body) {
		background: #000;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}

	/* Introduction Section */
	.intro-section {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(180deg, #000 0%, #0a0a1a 50%, #000 100%);
		padding: 4rem 2rem;
		z-index: 1;
	}

	.intro-content {
		max-width: 800px;
		text-align: center;
		opacity: 0;
		animation: fadeInUp 1.2s ease-out 0.3s forwards;
	}

	.intro-title {
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 300;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.95);
		margin-bottom: 2rem;
		text-transform: uppercase;
	}

	.intro-description {
		font-size: clamp(1rem, 2vw, 1.25rem);
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.7);
		font-weight: 300;
	}

	/* Title Screen Section */
	.title-section {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(180deg, #000 0%, #0a1520 100%);
		overflow: hidden;
		z-index: 2;
	}

	.title-content {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.main-title {
		font-size: clamp(4rem, 10vw, 8rem);
		font-weight: 700;
		letter-spacing: 0.05em;
		color: rgba(255, 255, 255, 0.98);
		margin: 0;
		text-transform: uppercase;
		position: relative;
		z-index: 3;
		text-shadow: 0 0 30px rgba(173, 216, 230, 0.3);
		animation: fadeInScale 1.5s ease-out;
	}

	.subtitle {
		font-size: clamp(1rem, 2.5vw, 1.5rem);
		color: rgba(255, 255, 255, 0.6);
		font-weight: 300;
		letter-spacing: 0.2em;
		margin-top: 2rem;
		position: relative;
		z-index: 3;
		animation: fadeIn 2s ease-out 0.5s both;
	}

	.mountain-container {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 60%;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		z-index: 2;
		pointer-events: none;
	}

	.mountain-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center bottom;
		transform-origin: center bottom;
		will-change: transform;
		filter: brightness(0.9) contrast(1.1);
		opacity: 0.85;
	}

	/* Cloud Bank Section */
	.cloud-section {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(180deg, #0a1520 0%, #2a3a4a 50%, #1a2530 100%);
		overflow: hidden;
		z-index: 3;
	}

	.cloud-layer {
		position: absolute;
		width: 120%;
		height: 100%;
		background-image: 
			radial-gradient(ellipse at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
			radial-gradient(ellipse at 60% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
			radial-gradient(ellipse at 80% 40%, rgba(255, 255, 255, 0.12) 0%, transparent 50%);
		background-size: 100% 100%;
		opacity: 0.6;
		will-change: transform;
	}

	.cloud-layer-1 {
		bottom: 0;
		left: -10%;
		animation: cloudFloat1 20s infinite ease-in-out;
	}

	.cloud-layer-2 {
		bottom: 20%;
		left: -10%;
		animation: cloudFloat2 25s infinite ease-in-out;
		opacity: 0.4;
	}

	.cloud-layer-3 {
		bottom: 40%;
		left: -10%;
		animation: cloudFloat3 30s infinite ease-in-out;
		opacity: 0.3;
	}

	/* Foggy Sky Section */
	.fog-section {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(180deg, #1a2530 0%, #3a4a5a 50%, #2a3540 100%);
		overflow: hidden;
		z-index: 4;
	}

	.fog-layer {
		position: absolute;
		width: 100%;
		height: 100%;
		background: 
			radial-gradient(ellipse 80% 50% at 30% 40%, rgba(200, 220, 240, 0.3) 0%, transparent 70%),
			radial-gradient(ellipse 70% 40% at 70% 60%, rgba(180, 210, 230, 0.25) 0%, transparent 60%);
		will-change: transform, opacity;
		filter: blur(40px);
	}

	.fog-1 {
		top: 0;
		animation: fogDrift1 15s infinite ease-in-out;
	}

	.fog-2 {
		top: 30%;
		animation: fogDrift2 18s infinite ease-in-out;
	}

	.fog-3 {
		top: 60%;
		animation: fogDrift3 20s infinite ease-in-out;
	}

	/* Mountain Top Section */
	.mountain-top-section {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(180deg, #2a3540 0%, #1a2530 100%);
		overflow: hidden;
		z-index: 5;
	}

	.mountain-top-container {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.mountain-peak {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 70%;
		background: 
			linear-gradient(135deg, transparent 30%, #1a1f2a 30%, #1a1f2a 35%, transparent 35%),
			linear-gradient(45deg, transparent 65%, #252a35 65%, #252a35 70%, transparent 70%);
		clip-path: polygon(0% 100%, 25% 40%, 50% 60%, 75% 35%, 100% 100%);
		will-change: transform;
	}

	.sky-gradient {
		position: absolute;
		top: 0;
		width: 100%;
		height: 30%;
		background: linear-gradient(180deg, #4a5a6a 0%, #2a3540 100%);
	}

	/* Horizontal Scroll 3D Landscape Section */
	.horizontal-scroll-section {
		position: relative;
		min-height: 300vh;
		background: linear-gradient(180deg, #1a2530 0%, #0a1520 100%);
		overflow: hidden;
		z-index: 6;
		perspective: 1000px;
	}

	.scroll-container {
		position: sticky;
		top: 0;
		height: 100vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding-left: 10vw;
	}

	.landscape-3d {
		position: relative;
		width: 300vw;
		height: 80vh;
		transform-style: preserve-3d;
		will-change: transform;
	}

	.landscape-layer {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 20px;
	}

	.layer-back {
		background: linear-gradient(180deg, #3a4a5a 0%, #2a3a4a 50%, #1a2a3a 100%);
		transform: translateZ(-200px) scale(1.2);
		opacity: 0.6;
	}

	.layer-mid {
		background: linear-gradient(180deg, #4a5a6a 0%, #3a4a5a 50%, #2a3a4a 100%);
		transform: translateZ(-100px) scale(1.1);
		opacity: 0.8;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
	}

	.layer-front {
		background: linear-gradient(180deg, #5a6a7a 0%, #4a5a6a 50%, #3a4a5a 100%);
		transform: translateZ(0) scale(1);
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
		background-image: 
			radial-gradient(circle at 20% 80%, rgba(100, 150, 200, 0.3) 0%, transparent 50%),
			radial-gradient(circle at 60% 70%, rgba(80, 130, 180, 0.2) 0%, transparent 50%);
	}

	.label {
		position: absolute;
		width: 200px;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		will-change: transform, opacity;
		transition: opacity 0.3s ease;
	}

	.label-1 {
		left: 15%;
		top: 20%;
	}

	.label-2 {
		left: 45%;
		top: 35%;
	}

	.label-3 {
		left: 75%;
		top: 50%;
	}

	.label-content h3 {
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.95);
		margin: 0 0 0.5rem 0;
		font-weight: 600;
		letter-spacing: 0.1em;
	}

	.label-content p {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
		margin: 0;
		font-weight: 300;
	}

	/* River Journey Section */
	.river-journey {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(180deg, #0a1520 0%, #000 100%);
		padding: 4rem 2rem;
		z-index: 1;
	}

	.journey-content {
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Animations */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeInScale {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes cloudFloat1 {
		0%, 100% { transform: translateX(0); }
		50% { transform: translateX(30px); }
	}

	@keyframes cloudFloat2 {
		0%, 100% { transform: translateX(0); }
		50% { transform: translateX(-40px); }
	}

	@keyframes cloudFloat3 {
		0%, 100% { transform: translateX(0); }
		50% { transform: translateX(25px); }
	}

	@keyframes fogDrift1 {
		0%, 100% { transform: translateY(0) translateX(0); }
		50% { transform: translateY(-20px) translateX(30px); }
	}

	@keyframes fogDrift2 {
		0%, 100% { transform: translateY(0) translateX(0); }
		50% { transform: translateY(15px) translateX(-25px); }
	}

	@keyframes fogDrift3 {
		0%, 100% { transform: translateY(0) translateX(0); }
		50% { transform: translateY(-10px) translateX(20px); }
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.intro-section,
		.title-section {
			padding: 2rem 1rem;
		}

		.mountain-container {
			height: 50%;
		}
	}
</style>
