<script lang="ts">
    import { T } from '@threlte/core';
    import RhineTerrain from './RhineTerrain.svelte';
    
    let { progress = 0 } = $props();

    // Map the 0-1 scroll progress to 3D coordinates
    // As progress goes from 0 to 1, camera moves from X:0 to X:500
    let camX = $derived(progress * 500);
    let camZ = $derived(100 - (progress * 50)); // Zoom in slightly
    let lookAtX = $derived(camX + 20);
</script>

<T.FogExp2 color="#050a0f" density={0.005} />
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[10, 20, 10]} intensity={1} />

<T.PerspectiveCamera
    makeDefault
    position={[camX, 40, camZ]}
    lookAt={[lookAtX, 0, 0]} 
/>

<RhineTerrain />