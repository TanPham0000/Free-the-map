<script lang="ts">
  import { onMount } from 'svelte';
  import type { SvelteComponent } from 'svelte';

  export let component: () => Promise<{ default: typeof SvelteComponent }>;
  export let props: Record<string, any> = {};

  let visible = false;
  let Component: typeof SvelteComponent | null = null;
  let element: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !visible) {
          visible = true;
          component().then((mod) => {
            Component = mod.default;
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  });
</script>

<div bind:this={element}>
  {#if Component}
    <svelte:component this={Component} {...props} />
  {:else}
    <!-- Loading placeholder -->
    <div class="loading-placeholder"></div>
  {/if}
</div>

<style>
  .loading-placeholder {
    min-height: 100vh;
    background: #000;
  }
</style>