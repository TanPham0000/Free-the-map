<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	onMount(() => {
		// Keep this in sync with the overall animation length
		const totalDurationMs = 2200;
		const timeout = setTimeout(() => {
			dispatch('finished');
		}, totalDurationMs);

		return () => {
			clearTimeout(timeout);
		};
	});
</script>

<div class="preloader-overlay">
	<div class="dot-sequence">
		<div class="dot"></div>
		<div class="ripple ripple-1"></div>
		<div class="ripple ripple-2"></div>
	</div>
</div>

<style>
	.preloader-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: radial-gradient(circle at center, #050a10 0%, #000 70%);
		z-index: 10000;
		pointer-events: none;
		animation: preloader-fade-out 0.4s ease-out 1.9s forwards;
	}

	.dot-sequence {
		position: relative;
		width: 40px;
		height: 40px;
	}

	.dot {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #ffffff;
		box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
		transform: translate(-50%, -50%) translateY(-60vh);
		animation:
			dot-fall 0.9s cubic-bezier(0.19, 1, 0.22, 1) forwards,
			dot-settle 0.4s ease-out 0.9s forwards;
	}

	.ripple {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.8);
		transform: translate(-50%, -50%) scale(0.2);
		opacity: 0;
		pointer-events: none;
	}

	.ripple-1 {
		animation: ripple 1.2s ease-out 0.8s forwards;
	}

	.ripple-2 {
		animation: ripple 1.2s ease-out 1s forwards;
	}

	@keyframes dot-fall {
		0% {
			transform: translate(-50%, -50%) translateY(-60vh);
		}
		80% {
			transform: translate(-50%, -50%) translateY(5px);
		}
		100% {
			transform: translate(-50%, -50%) translateY(0);
		}
	}

	@keyframes dot-settle {
		0% {
			transform: translate(-50%, -50%) scale(1);
			box-shadow: 0 0 24px rgba(255, 255, 255, 0.9);
		}
		50% {
			transform: translate(-50%, -50%) scale(1.25);
			box-shadow: 0 0 32px rgba(255, 255, 255, 1);
		}
		100% {
			transform: translate(-50%, -50%) scale(1);
			box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
		}
	}

	@keyframes ripple {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.2);
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(6);
			border-color: rgba(255, 255, 255, 0);
		}
	}

	@keyframes preloader-fade-out {
		to {
			opacity: 0;
		}
	}
</style>

