<script>
	import favicon from '$lib/assets/favicon.svg';
	import CustomCursor from '$lib/components/CustomCursor.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<CustomCursor />
{@render children()}
