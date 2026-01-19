<script lang="ts">
    import { T } from '@threlte/core';
    import { useTexture } from '@threlte/extras';

    // 1. Heightmap: White is high mountains, Black is the river
    const heightMap = useTexture('/maps/rhine-heightmap.jpg');
    // 2. Satellite: The actual visual "skin" of the earth
    const satellite = useTexture('/maps/rhine-satellite.jpg');
</script>

{#await Promise.all([heightMap, satellite]) then [hMap, sMap]}
    <T.Mesh rotation.x={-Math.PI / 2} position.y={0}>
        <T.PlaneGeometry args={[1000, 500, 512, 256]} />
        <T.MeshStandardMaterial
            map={sMap}
            displacementMap={hMap}
            displacementScale={60} 
            roughness={0.8}
            metalness={0.1}
        />
    </T.Mesh>
{:catch error}
    <!-- Fallback if textures don't load -->
    <T.Mesh rotation.x={-Math.PI / 2} position.y={0}>
        <T.PlaneGeometry args={[1000, 500, 64, 32]} />
        <T.MeshStandardMaterial
            color="#4a5a6a"
            roughness={0.8}
        />
    </T.Mesh>
{/await}