<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const revealProgress = writable(0);
	let revealSection: HTMLElement;

	onMount(() => {
		const section = revealSection;
		const updateProgress = () => {
			const rect = section.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			const progressValue = Math.max(0, Math.min(1, (windowHeight - rect.top) / (rect.height + windowHeight)));
			revealProgress.set(progressValue);
		};
		window.addEventListener('scroll', updateProgress);
		updateProgress();
		return () => window.removeEventListener('scroll', updateProgress);
	});
</script>

<section class="text-reveal-section" bind:this={revealSection}>
	<h3 style:color={$revealProgress > 0.1 ? 'white' : '#666'}>On this side you call me "le Rhin"</h3>
	<h3 style:color={$revealProgress > 0.4 ? 'white' : '#666'}>And on this side you call me "der Rhein"</h3>
	<h3 style:color={$revealProgress > 0.5 ? 'white' : '#666'}>But I am the same river, uniting lands and people</h3>
</section>

<style>
	.text-reveal-section {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #000;
		padding: 4rem 2rem;
		text-align: center;
	}

	.text-reveal-section h3 {
		margin: 0.5rem 0;
		transition: color 0.3s ease;
	}
</style>