<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import Preloader from '$lib/components/Preloader.svelte';
	import RhineScrollIndicator from '$lib/components/RhineScrollIndicator.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<CustomCursor />
<Preloader />
<RhineScrollIndicator />

{@render children()}
