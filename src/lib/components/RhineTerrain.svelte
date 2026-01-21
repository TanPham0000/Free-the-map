<script>
  import { onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { VITE_MAPBOX_API_KEY } from '$lib/data/apiKey.js';

  gsap.registerPlugin(ScrollTrigger);

  let map;
  let mapContainer;

  // The waypoints for our fly-through
//   const flightPath = [
//   { name: "Start Rhine (Lai da Tuma)", center: [8.6558, 46.6403], zoom: 15.5, pitch: 65, bearing: -30 },
//   { name: "Point 1", center: [8.6667, 46.6344], zoom: 15.8, pitch: 70, bearing: 20 },
//   { name: "Point 3", center: [8.6728, 46.6325], zoom: 16.0, pitch: 75, bearing: 60 },
//   { name: "Point 4", center: [8.6753, 46.6322], zoom: 16.2, pitch: 80, bearing: 80 },
//   { name: "Point 6", center: [8.6864, 46.6356], zoom: 15.5, pitch: 70, bearing: 70 },
//   { name: "Point 8", center: [8.7064, 46.6539], zoom: 14.5, pitch: 55, bearing: 30 },
//   { name: "Point 9", center: [8.7356, 46.6628], zoom: 14.0, pitch: 50, bearing: 45 }
// ];
  const flightPath = [
    { center: [8.654, 46.638], zoom: 16.5, pitch: 85, bearing: -30 },   // Start high
    { center: [8.654, 46.638], zoom: 17, pitch: 70, bearing: -40 }, // Zoom into Lake
    { center: [8.670, 46.642], zoom: 14, pitch: 80, bearing: 60 }, // Follow the stream
    { center: [8.700, 46.650], zoom: 13, pitch: 60, bearing: 30 }  // Move downstream  
  ];

  onMount(() => {
    mapboxgl.accessToken = VITE_MAPBOX_API_KEY;

    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/satellite-v9?optimize=true', // Satellite is best for mountains
      center: flightPath[0].center,
      zoom: flightPath[0].zoom,
      pitch: flightPath[0].pitch,
      bearing: flightPath[0].bearing,
      interactive: false,
      attributionControl: false,
      // PERFORMANCE BOOST: Prefetch tiles to prevent white gaps
      refreshExpiredTiles: false,
      maxTileCacheSize: 20
    });

    map.on('style.load', () => {
      // 1. Add 3D Terrain
      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 128,
        'maxzoom': 12
      });
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // 2. Add Atmosphere/Fog for "Nice" visuals
      map.setFog({
        'range': [0.5, 2], // Distance range for fog effect low to high
        'color': 'white',
        'horizon-blend': 0.2
      });
      // 3. Setup Scroll Animation
      initScrollAnimation();
    });
  });

  function initScrollAnimation() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-area",
        start: "top top",
        scrub: 3, // Increasing this from 1 to 2 or 3 gives the map "breathing room" to catch up
        end: "bottom bottom"
      }
    });

    // Animate between waypoints
    flightPath.forEach((point, i) => {
      if (i === 0) return;
      tl.to(map.getCenter(), {
        duration: 1,
        onUpdate: function() {
          // Linear interpolation handled by GSAP
          const progress = this.progress();
          const start = flightPath[i-1];
          const end = flightPath[i];

          map.jumpTo({
            center: [
              start.center[0] + (end.center[0] - start.center[0]) * progress,
              start.center[1] + (end.center[1] - start.center[1]) * progress
            ],
            zoom: start.zoom + (end.zoom - start.zoom) * progress,
            pitch: start.pitch + (end.pitch - start.pitch) * progress,
            bearing: start.bearing + (end.bearing - start.bearing) * progress
          });
        }
      });
    });

    // Fade in the map when the section is reached
    ScrollTrigger.create({
      trigger: ".rhine-terrain-section",
      start: "top center",
      onEnter: () => gsap.to('.map-viewport', { opacity: 1, duration: 1 }),
      onLeaveBack: () => gsap.to('.map-viewport', { opacity: 0, duration: 1 })
    });
  }
</script>

<div class="map-viewport">
  <div bind:this={mapContainer} class="map"></div>
</div>

<div class="scroll-area">
  <section>
    <div class="card">
      <h2>The Source of the Rhine</h2>
      <p>Our journey begins at Lai da Tuma, 2,345 meters above sea level.</p>
    </div>
  </section>
  <section>
    <div class="card">
      <h2>The Sacred Lake</h2>
      <p>Nestled in the heart of the Swiss Alps, this is the cradle of Europe's great river.</p>
    </div>
  </section>
  <section>
    <div class="card">
      <h2>Flowing East</h2>
      <p>From here, the water begins its 1,230km journey to the North Sea.</p>
    </div>
  </section>
</div>

<style>
  :global(body) { margin: 0; overflow-x: hidden; font-family: sans-serif; }

  .map-viewport {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 1;
    opacity: 0;
  }
  .map { width: 100%; height: 100%; }

  .scroll-area {
    position: relative;
    z-index: 2;
    pointer-events: none; /* Allows scrolling through to the map if needed */
  }

  section {
    height: 100vh;
    display: flex;
    align-items: center;
    padding: 0 10%;
  }

  .card {
    pointer-events: auto;
    background: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
</style>