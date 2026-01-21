<script>
  import { onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
  import 'mapbox-gl/dist/mapbox-gl.css';

  gsap.registerPlugin(ScrollTrigger);

  let map;
  let mapContainer;

  // The waypoints for our fly-through
  const flightPath = [
    { center: [8.654, 46.638], zoom: 12, pitch: 45, bearing: 0 },   // Start high
    { center: [8.654, 46.638], zoom: 14.5, pitch: 70, bearing: -40 }, // Zoom into Lake
    { center: [8.670, 46.642], zoom: 14, pitch: 80, bearing: 60 }    // Follow the stream
  ];

  onMount(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGFucGhhbTExMSIsImEiOiJjbGxtbGs0N2wxejJ2M2p0NjB6Y3VkemRrIn0.Z-ixfCD8ebpm1xGXt5Y4lQ';

    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/satellite-v9', // Satellite is best for mountains
      center: flightPath[0].center,
      zoom: flightPath[0].zoom,
      pitch: flightPath[0].pitch,
      interactive: false 
    });

    map.on('style.load', () => {
      // 1. Add 3D Terrain
      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // 2. Add Atmosphere/Fog for "Nice" visuals
      map.setFog({
        'range': [0.5, 10],
        'color': 'white',
        'horizon-blend': 0.1
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
        end: "bottom bottom",
        scrub: 1 // Smoothness of the scroll follow
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