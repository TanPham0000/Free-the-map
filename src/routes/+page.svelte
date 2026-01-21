<script lang="ts">
	import TitleParallax from '$lib/components/TitleParallax.svelte';
	import RhineFull from '$lib/components/RhineFull.svelte';
	import RhineTerrain from '$lib/components/RhineTerrain.svelte';
  import RhineImageZoom from '$lib/components/RhineImageZoom.svelte';
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
<section class="rhine-terrain-section">
	<RhineTerrain />
</section>

<section>
	<RhineImageZoom />
</section>


<style>
	:global(body) {
		background: #000;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
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
		color: rgba(255, 255, 255);
		font-weight: 300;
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
</style>