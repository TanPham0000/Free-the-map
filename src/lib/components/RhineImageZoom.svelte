<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import RhineCropped from '$lib/assets/Rhine_Cropped.png';

	const scaleStore = writable(1);
	const opacityStore = writable(1);

	let sectionElement: HTMLElement;
	let handleScroll: () => void;

	onMount(() => {
		const section = sectionElement;
		const sectionTop = section.offsetTop;
		const sectionHeight = section.offsetHeight;

		handleScroll = () => {
			const scrollY = window.scrollY;
			const progress = Math.max(0, Math.min(1, (scrollY - sectionTop) / sectionHeight));
			scaleStore.set(1 + progress * 0.6); // Zoom to 1.5x
			opacityStore.set(0.9 - progress);
		};

		window.addEventListener('scroll', handleScroll);
	});

	onDestroy(() => {
		if (handleScroll) {
			window.removeEventListener('scroll', handleScroll);
		}
	});
</script>

<!-- Rhine Cropped Image Section - Zoom to top left and fade to black -->
<section class="rhine-zoom-section" bind:this={sectionElement} style:opacity={$opacityStore}>
	<div class="image-container">
		<img 
			src={RhineCropped} 
			alt="Rhine Cropped"
			style:transform="scale({$scaleStore})"
		/>
	</div>
</section>

<style>
	.rhine-zoom-section {
		position: relative;
		min-height: 150vh;
		overflow: hidden;
		background: linear-gradient(90deg, rgba(255, 0, 0, 0), rgba(0, 0, 0, 0));
	}

	.image-container {
		width: 100%;
		position: relative;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top left;
		user-select: none;
		pointer-events: none;
		transition: transform 0.1s ease-out;	
	}
</style>

