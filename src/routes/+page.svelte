<script lang="ts">
	import LazyLoad from '$lib/components/LazyLoad.svelte';
	import TitleParallax from '$lib/components/TitleParallax.svelte';
	import RhineFull from '$lib/components/RhineFull.svelte';
	import RhineTerrain from "$lib/components/RhineTerrain.svelte";
	import RhineImageZoom from '$lib/components/RhineImageZoom.svelte';
	import TextReveal from '$lib/components/TextReveal.svelte';
	
</script>

<!-- Introduction Section -->
<section class="intro-section">
	<div class="intro-content">
			<p class="intro-description">
				Here I am, a single drop of rain, falling onto a Swiss mountain. I merge with the water, and slowly I become
			</p>
			<h2 class="intro-description">- The Rhine -</h2>
	</div>
</section>

<TitleParallax />
<section>
	<h3>Content goes here</h3>
</section>
<RhineFull />
<LazyLoad component={() => import('$lib/components/RhineTerrain.svelte')} />

<!-- Text Section -->
<section class="text-section">
	<div class="text-content">
		<h2>The Journey Continues</h2>
		<p>
			I arrive and unfold. What carried me now carries me further. My current loosens, my shape dissolves.
			You humans call this the North Sea. I do not know names, only movement.
			What I was becomes part of something vast.
			This is not the end this is a new beginning. Only widening, drifting, becoming.
		</p>
		<p>
			As the river descends from the Alps, it gathers strength and purpose. Each tributary adds to its story,
			each bend in its course reveals new wonders. The Rhine is not just water flowing to the sea—it's a living
			testament to the power of persistence and transformation.
		</p>
	</div>
</section>
<RhineImageZoom />

<TextReveal />

<section class="text-section">
	<p>I flow for 1,324 kilometers, making me one of Europe’s longest rivers. For centuries, people have followed my banks, traded along my waters, and built cities beside me. They’ve given me borders, names, and stories but I simply keep flowing, just being me.</p>
</section> 

<section class="text-section" id="second-text-section">
	<p>I carry many lives within me. Bream, perch, eel, roach, zander and dace move through my waters, and even the majestic sturgeon is finding its way back.</p>
	<p>They travel through all of me, drifting from my wide mouth to my narrow stretches, slipping into side branches like the Kromme Rijn to spawn and migrate, with locks acting as vital gateways along the way.</p>
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
		z-index: 1;
	}

	.intro-content {
		max-width: 800px;
		text-align: center;
		animation: fadeInUp 1.2s ease-out 0.3s forwards;
	}

	.intro-description {
		line-height: 1.4;
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

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.intro-section {
			padding: 2rem 1rem;
		}
	}

	/* Text Section */
	.text-section {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000;
		padding: 4rem 2rem;
	}

	.text-content {
		text-align: center;
		padding : 1rem;
		width: 50%;
		word-break: break-all;
	}

	.text-content p {
		margin-bottom: 1.5rem;
	}
	
	#second-text-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 60%;
		justify-content: center;
	}

</style>