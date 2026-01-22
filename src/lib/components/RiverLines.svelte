<script lang="ts">
	// Two white lines moving from top to bottom resembling a river
</script>

<section class="river-lines-section">
	<div class="river-line line-1"></div>
	<div class="river-line line-2"></div>
</section>

<style>
	.river-lines-section {
		position: relative;
		min-height: 100vh;
		background: #000;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.river-line {
		position: absolute;
		width: 2px;
		height: 100%;
		background: rgba(255, 255, 255, 0.8);
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
	}

	.line-1 {
		left: 20%;
	}

	.line-2 {
		left: 80%;
	}
</style>
