<script lang="ts">
	import LazyLoad from '$lib/components/LazyLoad.svelte';
	import TitleParallax from '$lib/components/TitleParallax.svelte';
	import RhineFull from '$lib/components/RhineFull.svelte';
	import RhineTerrain from "$lib/components/RhineTerrain.svelte";
	import RhineImageZoom from '$lib/components/RhineImageZoom.svelte';
	import TextReveal from '$lib/components/TextReveal.svelte';
	import CloudsZoom from '$lib/components/CloudsZoom.svelte';
	import RiverLife from '$lib/components/RiverLife.svelte';
	import FloatingEllipses from '$lib/components/FloatingEllipses.svelte';
	
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
			each bend in its course reveals new wonders. The Rhine is not just water flowing to the sea, it's a living
			testament to the power of persistence and transformation.
		</p>
	</div>
</section>
<RhineImageZoom />

<TextReveal />

<section class="narrative-section">
	<p>I flow for 1,324 kilometers, making me one of Europe’s longest rivers. For centuries, people have followed my banks, traded along my waters, and built cities beside me. They’ve given me borders, names, and stories but I simply keep flowing, just being me.</p>
	<FloatingEllipses />
</section> 

<RiverLife />

<section class="narrative-section">
	<p>Plastic and waste
I feel heavier than I used to. Plastic and debris drift along my surface and sink into my depths, far more than people once believed. Every day, tens of thousands of pieces move with my current, slowly wearing me down as I carry them toward the sea.
What flows into me doesn’t always fade away. Industrial chemicals and traces of medicine linger in my waters, changing what I can safely give back. As more people lean on me for drinking water, the pressure tightens. I am asked to be clean while still carrying the weight of human use.</p>
	<FloatingEllipses />
</section>

<section class="narrative-section">
	<p>My waters are warming, slowly but steadily, making it harder for cold-loving life to stay with me as I move forward in time.
I am never just a single line. I loosen, split, and send parts of myself outward. In small streams, side arms, and quiet branches, I reach places my main flow cannot. These offshoots slow me down, give me space to breathe, and let life settle and return.
</p>
	<FloatingEllipses />
</section>

<section class="narrative-section">
	<p>People say my journey ends in the North Sea. Before that, I loosen myself, split, and spread out becoming many instead of one. Through three main paths, my water finally reaches the sea, each finding its own way outward and spreading trough the whole world.
Once in the sea I rise into the air, return as rain, and fall once more onto the mountain—where I begin again.
</p>
	<FloatingEllipses />
</section>

<CloudsZoom />

<section>
	
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
		word-break: normal;
	}

	.text-content p {
		margin-bottom: 1.5rem;
	}
	

	/* Narrative Sections */
	.narrative-section {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		color: #e0f7ff;
		animation: fadeIn 1.5s ease-out;
	}

	.narrative-section p {
		max-width: 800px;
		text-align: center;
		line-height: 1.8;
		margin: 0 auto;
		font-size: 1.1rem;
		text-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

</style>