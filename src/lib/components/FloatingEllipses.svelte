<script lang="ts">
	import { onMount } from 'svelte';

	interface Ellipse {
		top: number;
		left: number;
		speed: number;
	}

	let { count = 5 }: { count?: number } = $props();

	let scrollY = $state(0);

	function handleScroll() {
		scrollY = window.scrollY;
	}

	function generateEllipses(num: number): Ellipse[] {
		const ellipses: Ellipse[] = [];
		for (let i = 0; i < num; i++) {
			ellipses.push({
				top: Math.random() * 80 + 10, // 10% to 90%
				left: Math.random() * 80 + 10, // 10% to 90%
				speed: -(Math.random() * 0.5 + 0.1) // -0.1 to -0.6
			});
		}
		return ellipses;
	}

	let ellipses = $derived(generateEllipses(count));

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

{#each ellipses as ellipse}
	<div
		class="ellipse"
		style="top: {ellipse.top}%; left: {ellipse.left}%; transform: translateY({scrollY * ellipse.speed}px);"
	></div>
{/each}

<style>
	.ellipse {
		position: absolute;
		width: 7px;
		height: 10px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.8);
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.6), 0 0 20prgba(224, 228, 230, 0.4)4);
		pointer-events: none;
	}
</style>