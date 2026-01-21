<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
    import Scene from '$lib/components/Scene.svelte';
	

	import clouds from '$lib/assets/Clouds.png';
	import foregroundMountain from '$lib/assets/Foreground_mountain.png';
	import rhineFull from '$lib/assets/Rhine_full.png';

	let introSection: HTMLElement;
	let titleSection: HTMLElement;
	let mountainTopSection: HTMLElement;
	let rhineFullSection: HTMLElement;
	let horizontalScrollSection: HTMLElement;
	
	let scrollY = $state(0);
	let horizontalScroll = $state(0);
	let rhineZoomProgress = $state(0);

	function handleScroll() {
		scrollY = window.scrollY;
		
		// Calculate zoom progress for Rhine full section (zoom to 140% at bottom)
		if (rhineFullSection) {
			const rect = rhineFullSection.getBoundingClientRect();
			const sectionTop = rect.top;
			const sectionHeight = rect.height;
			const viewportHeight = window.innerHeight;
			
			// When section is in viewport, calculate zoom progress
			if (sectionTop < viewportHeight && sectionTop > -sectionHeight) {
				rhineZoomProgress = Math.max(0, Math.min(1, (viewportHeight - sectionTop) / (viewportHeight + sectionHeight)));
			} else if (sectionTop <= -sectionHeight) {
				rhineZoomProgress = 1;
			} else {
				rhineZoomProgress = 0;
			}
		}
		
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

	// Calculate zoom scale (from 1.0 to 1.4) and transform origin (focus on bottom)
	let rhineScale = $derived(1.0 + (rhineZoomProgress * 0.4)); // 1.0 to 1.4 (140%)
	let rhineTransform = $derived(`scale(${rhineScale})`);

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
			<p class="intro-description">
				Here I am, a single drop of rain, falling onto a Swiss mountain. I merge with the water, and slowly I become
			</p>
			<h2 class="intro-description">The Rhine</h2>
	</div>
</section>

<!-- Title Screen Section with Parallax Mountain -->
<section class="title-section" bind:this={titleSection}>
	<div class="title-content">
		<h1 class="main-title">Free the Map</h1>
		<p class="subtitle">A journey from source to sea</p>
	</div>
</section>

<!-- Mountain Top Section -->
<section class="mountain-top-section" bind:this={mountainTopSection}>
		<img 
			class="parallax-layer clouds" 
			src={clouds} 
			alt="Clouds"
			style="transform: translateY({scrollY * -0.3}px);"
		/>
		<!-- Foreground mountain layer -->
		<img 
			class="parallax-layer foreground-mountain" 
			src={foregroundMountain} 
			alt="Foreground mountain"
			style="transform: translateY({scrollY * -0.5}px);"
		/>	
</section>
<!-- Rhine Full Image Section - Zooms to 140% focusing on bottom -->
<section class="rhine-full-section" bind:this={rhineFullSection}>
	<div class="rhine-image-container" style="transform: {rhineTransform};">
		<img src={rhineFull} alt="Rhine Full" />
	</div>
</section>

<!-- 3D Landscape Section -->
<section class="horizontal-scroll-section" bind:this={horizontalScrollSection}>
	<div class="scroll-container">
		<Canvas>
			<Scene progress={horizontalScroll} />
		</Canvas>
	</div>
</section>

<style>
	:global(body) {
		background: #000;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}

	h1 {
		font-family: 'Times New Roman', Times, serif;
		font-weight: 700;
		color: white;
	}

	h2 {
		font-family: 'Times New Roman', Times, serif;
		font-weight: 400;
		color:white;
	}

	/* Introduction Section */
	.intro-section {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.intro-content {
		max-width: 800px;
		text-align: center;
		animation: fadeInUp 1.2s ease-out 0.3s forwards;
	}

	.intro-description {
		line-height: 1.4;
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
		overflow: hidden;
	}

	.title-content {
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

	img {
		user-select: none;
		pointer-events: none;
		width: 100%;
		height: auto;
	}

	/* Mountain Top Section */
	.mountain-top-section {
		position: relative;
		min-height: 100vh;
		z-index: 5;
	}

	.parallax-layer {
		position: absolute;
		width: 100%;
		height: auto;
		object-fit: cover;
		will-change: transform;
		pointer-events: none;
	}

	.clouds {
		filter: blur(10px);
		z-index: 5;
		width: 100%;
	}

	.foreground-mountain {
		z-index: 3;
	}

	/* Rhine Full Section - Zoom to 140% */
	.rhine-full-section {
		position: relative;
		z-index: 5;
		overflow: hidden;
		background: #000;
		display: flex;
		align-items: flex-end;
		justify-content: center;

	}

	.rhine-image-container {
		position: sticky;
		bottom: 0;
		width: 100%;
		height: 100vh;
		transform-origin: center bottom;
		will-change: transform;
		transition: transform 0.1s ease-out;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.rhine-image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center bottom;
	}

	/* 3D Landscape Section */
	.horizontal-scroll-section {
		position: relative;
		min-height: 300vh;
		
		overflow: hidden;
		z-index: 6;
		perspective: 1000px;
	}

	.scroll-container :global(canvas) {
		display: block;
		width: 100%;
		height: 100%;
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

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.intro-section,
		.title-section {
			padding: 2rem 1rem;
		}
	}
</style>
