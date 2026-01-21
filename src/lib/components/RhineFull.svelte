<script lang="ts">
	import Rhine_Full from '$lib/assets/Rhine_full.png';
</script>

<!-- Rhine Full Image Section (static for now) -->
<section class="rhine-full-section">
	<img src={Rhine_Full} alt="Rhine Full"/>
</section>

<style>
	.rhine-full-section {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: #000;
	}

	.rhine-full-section img {
		width: 100%;
		height: auto;
		object-fit: cover;
		user-select: none;
		pointer-events: none;
		animation: scaleIn 1.2s ease-out 0.3s forwards;
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.5);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>

