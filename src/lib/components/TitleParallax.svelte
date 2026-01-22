<script lang="ts">
	import { onMount } from 'svelte';

	import clouds from '$lib/assets/Clouds.png';
	import foregroundMountain from '$lib/assets/Foreground_mountain.png';

	let titleSection: HTMLElement;
	let mountainTopSection: HTMLElement;

	let scrollY = $state(0);

	function handleScroll() {
		scrollY = window.scrollY;
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<!-- Title Screen Section with Parallax Mountain -->
<section class="title-section" bind:this={titleSection}>
	<div class="title-content">
		<h1 class="main-title">United by rivers</h1>
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

	<img
		class="parallax-layer foreground-mountain"
		src={foregroundMountain}
		alt="Foreground mountain"
		style="transform: translateY({scrollY * -0.5}px);"
	/>
</section>

<style>
	h1 {
		font-family: 'Times New Roman', Times, serif;
		font-weight: 700;
		color: white;
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
		scale: 1.1;
	}

	.foreground-mountain {
		z-index: 3;
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

	@media (max-width: 768px) {
		.title-section {
			padding: 2rem 1rem;
		}
	}
</style>

