<script lang="ts">
  import { onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { VITE_MAPBOX_API_KEY } from '$lib/config/apiKey.js';

  gsap.registerPlugin(ScrollTrigger);

  let map: mapboxgl.Map;
  let mapContainer: HTMLElement;

  // The waypoints for our fly-through
  const flightPath: { center: [number, number]; zoom: number; pitch: number; bearing: number }[] = [
    { center: [8.654, 46.638], zoom: 16.5, pitch: 85, bearing: -30 },   // Start high
    { center: [8.654, 46.638], zoom: 17, pitch: 70, bearing: -40 }, // Zoom into Lake
    { center: [8.670, 46.642], zoom: 14, pitch: 80, bearing: 60 }, // Follow the stream
    { center: [8.700, 46.650], zoom: 13, pitch: 60, bearing: 30 }  // Move downstream  
  ];

  onMount(() => {
    if (!VITE_MAPBOX_API_KEY) {
      console.error('Mapbox API key not found');
      return;
    }
    mapboxgl.accessToken = VITE_MAPBOX_API_KEY;

    map = new mapboxgl.Map({
    container: mapContainer,
    style: 'mapbox://styles/tanpham111/cmkoj8pev001n01qx4ell39fa', // Custom style with muted colors
    center: flightPath[0].center,
    zoom: flightPath[0].zoom,
    pitch: flightPath[0].pitch,
    bearing: flightPath[0].bearing,
    interactive: false,
    attributionControl: false,
    refreshExpiredTiles: false,
    maxTileCacheSize: 20,
    minZoom: 10,
    maxZoom: 18
  });

  map.on('error', (e) => console.error('Mapbox error:', e?.error || e));

    map.on('style.load', () => {
      // 1. Add 3D Terrain
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 128,
        maxzoom: 11
      });
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // 2. Add Atmosphere/Fog for "Nice" visuals
      map.setFog({
        'range': [-0.5, 1], // Distance range for fog effect low to high
        'color': '#f0f0f0', // Light gray fog color
        'horizon-blend': 0.3
      });

      map.setLight({
        anchor: 'viewport',
        color: '#ffffff',
        intensity: 0.8 // Very low intensity for a moody, cloudy day
      });

      map.addLayer({
        'id': 'cloud-layer',
        'type': 'background',
        'paint': {
          'background-color': '#ffffff',
          'background-opacity': 0.4 // Makes everything look like it's under a cloud blanket
        }
      });
    });

    map.on('load', () => {
      // 3. Setup Scroll Animation after map is fully loaded
      initScrollAnimation();
    });

  });

  function initScrollAnimation() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".rhine-terrain-section",
        start: "top top",
        end: "bottom bottom",
        scrub: 3, // Increasing this from 1 to 2 or 3 gives the map "breathing room" to catch up
        pin: false, // Don't pin - allow normal scrolling
        anticipatePin: 0
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

    // Fade in/out the map based on scroll position
    ScrollTrigger.create({
      trigger: ".rhine-terrain-section",
      start: "top center",
      end: "bottom center",
      onEnter: () => gsap.to('.map-viewport', { opacity: 1, duration: 1 }),
      onLeave: () => {
        // Fade map to black when leaving the section
        gsap.to('.map-viewport', { opacity: 0, duration: 1 });
        gsap.to('.fade-to-black', { opacity: 1, duration: 1 });
      },
      onEnterBack: () => {
        // Fade back in when scrolling back up
        gsap.to('.map-viewport', { opacity: 1, duration: 1 });
        gsap.to('.fade-to-black', { opacity: 0, duration: 1 });
      },
      onLeaveBack: () => gsap.to('.map-viewport', { opacity: 0, duration: 1 })
    });

    // Fade to black overlay at the end of the section
    ScrollTrigger.create({
      trigger: ".rhine-terrain-section",
      start: "bottom 80%",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        // Gradually fade to black as we approach the end
        gsap.to('.fade-to-black', { opacity: self.progress, duration: 0.1 });
      }
    });
  }
  
</script>

<section class="rhine-terrain-section">
  <div class="map-viewport">
    <div bind:this={mapContainer} class="map"></div>
  </div>
  
  

  <div class="scroll-area">
    <section>
      <div class="card" id="intro-card">
        <h2>From humble beginnings</h2>
      </div>
    </section>
    <section>
      <div class="card" id="lake-card">
        <h2>The Rhine</h2>
        <p>I am small here. I feel cold ground and soft clay. You humans call this my beginning. To me, it feels like waking up.</p>
      </div>
    </section>
    <section>
      <div class="card" id="stream-card">
        <h2>Flowing East</h2>
        <p>I don’t know where I will end. I only know I cannot stand still. You measure me, name me, draw lines around me. I flow. That is enough.</p>
      </div>
    </section>
  </div>
  </section>

<style>
  .rhine-terrain-section {
    position: relative;
    min-height: 300vh; /* Ensure enough scroll space */
  }

  .map-viewport {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    opacity: 0;
    pointer-events: none;
  }

  .map {
    width: 100%;
    height: 100%;
  }

  .scroll-area {
    position: relative;
    z-index: 2;
    min-height: 300vh; /* Match section height for proper scroll */
    pointer-events: none; /* Allows scrolling through to the map if needed */
  }

  .scroll-area section {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10%;
  }

  .card {
    pointer-events: auto;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    background-color: rgba(36, 36, 36, 0.8);
  }

  #intro-card {
    text-align: center;
    
  }

</style>