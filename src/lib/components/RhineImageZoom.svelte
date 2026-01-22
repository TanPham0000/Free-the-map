<script lang="ts">
	import { onMount } from 'svelte';
	import RhineCropped from '$lib/assets/Rhine_Cropped.png';
</script>

<!-- Rhine Cropped Image Section - Zoom to top left and fade to black -->
<section class="rhine-zoom-section">
	<div class="image-container">
		<img 
			src={RhineCropped} 
			alt="Rhine Cropped"
		/>
	</div>
</section>

<style>
	.rhine-zoom-section {
		position: relative;
		min-height: 150vh;
		overflow: hidden;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top left;
		user-select: none;
		pointer-events: none;
	}

</style>

