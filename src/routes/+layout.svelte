<script>
	import favicon from '$lib/assets/favicon.svg';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import Preloader from '$lib/components/Preloader.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<CustomCursor />
<Preloader />

{@render children()}
