<script lang="ts">
	import TitleParallax from '$lib/components/TitleParallax.svelte';
	import RhineFull from '$lib/components/RhineFull.svelte';
	import RhineTerrain from "$lib/components/RhineTerrain.svelte";
	import RhineImageZoom from '$lib/components/RhineImageZoom.svelte';
	import RiverLines from '$lib/components/RiverLines.svelte';
</script>

<!-- Introduction Section -->
<section class="intro-section">
	<div class="intro-content">
			<p class="intro-description">
				Here I am, a single drop of rain, falling onto a Swiss mountain. I merge with the water, and slowly I become
			</p>
			<h2 class="intro-description">The Rhine.</h2>
	</div>
</section>

<TitleParallax />
<section>
	<h3>Content goes here</h3>
</section>
<RhineFull />
<RhineTerrain />
<RhineImageZoom />
<RiverLines />

<!-- Text Section -->
<section class="text-section">
	<div class="text-content">
		<h2>The Journey Continues</h2>
		<p>
			From the pristine alpine lakes of Switzerland, the Rhine River embarks on its epic journey across Europe.
			Flowing through dramatic landscapes, it carves through mountains, nourishes fertile valleys, and connects
			diverse cultures along its path.
		</p>
		<p>
			As the river descends from the Alps, it gathers strength and purpose. Each tributary adds to its story,
			each bend in its course reveals new wonders. The Rhine is not just water flowing to the sea—it's a living
			testament to the power of persistence and transformation.
		</p>
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
		max-width: 800px;
		text-align: center;
	}
</style>