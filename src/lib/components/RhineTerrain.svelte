<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import type { Map } from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { VITE_MAPBOX_API_KEY } from '$lib/config/apiKey.js';

  gsap.registerPlugin(ScrollTrigger);

  let map: Map;
  let mapContainer: HTMLElement;

  // The waypoints for our fly-through
 const flightPath = [
    { name: "Rossbodenstock", center: [8.6511, 46.6353], zoom: 15, pitch: 45, bearing: 0 },
    { name: "Lake Hover", center: [8.6700, 46.6325], zoom: 17, pitch: 45, bearing: 35 },
    { name: "Valley Descent", center: [8.6781, 46.6325], zoom: 15.8, pitch: 45, bearing: 0 },
    { name: "In the Valley", center: [8.6906, 46.6453], zoom: 15.0, pitch: 85, bearing: 10 },
    { name: "Zoom Out", center: [8.7042, 46.6606], zoom: 13.0, pitch: 45, bearing: 0 }
  ];

  onMount(async () => {
    const mapboxgl = (await import('mapbox-gl')).default;
    mapboxgl.accessToken = VITE_MAPBOX_API_KEY;

    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/tanpham111/cmkoj8pev001n01qx4ell39fa',
      center: flightPath[0].center as [number, number],
      zoom: flightPath[0].zoom,
      pitch: flightPath[0].pitch,
      bearing: flightPath[0].bearing,
      interactive: false,
      attributionControl: false,
      // PERFORMANCE: Prevent unnecessary background computation
      preserveDrawingBuffer: false, 
      trackResize: false,
      performanceMetrics: false,
      fadeDuration: 0 // Disable tile fading to save GPU
    });

    map.on('style.load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 256, // 256 is often more efficient for 3D than 128
        maxzoom: 12
      });
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // RESOURCE SAVING: Tighten fog to "cull" (ignore) distant mountains
      map.setFog({
        'range': [0.2, 2.5], 
        'color': '#f0f0f0',
        'horizon-blend': 0.1
      });
    });

    map.on('load', () => {
      initScrollAnimation();
      // Pre-fetch tiles for the whole route
      map.setPrefetchZoomDelta(2);
    });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  });

  function initScrollAnimation() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".rhine-terrain-section",
        start: "top top",
        end: "bottom bottom",
        scrub: 2.5, // Smooth glide
      }
    });

    // We animate a "proxy" object instead of the map directly
    const cameraProxy = { 
        lng: flightPath[0].center[0], 
        lat: flightPath[0].center[1], 
        zoom: flightPath[0].zoom, 
        pitch: flightPath[0].pitch, 
        bearing: flightPath[0].bearing 
    };

    flightPath.forEach((point, i) => {
      if (i === 0) return;

      tl.to(cameraProxy, {
        lng: point.center[0],
        lat: point.center[1],
        zoom: point.zoom,
        pitch: point.pitch,
        bearing: point.bearing,
        duration: 1,
        ease: "none",
        onUpdate: () => {
          // Wrap map updates in requestAnimationFrame for buttery smoothness
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(() => {
            map.jumpTo({
              center: [cameraProxy.lng, cameraProxy.lat],
              zoom: cameraProxy.zoom,
              pitch: cameraProxy.pitch,
              bearing: cameraProxy.bearing
            });
          });
        }
      });
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
        // gsap.to('.fade-to-black', { opacity: 1, duration: 1 });
      },
      onEnterBack: () => {
        // Fade back in when scrolling back up
        gsap.to('.map-viewport', { opacity: 1, duration: 1 });
        // gsap.to('.fade-to-black', { opacity: 0, duration: 1 });
      },
      onLeaveBack: () => gsap.to('.map-viewport', { opacity: 0, duration: 1 })
    });

    // Fade to black overlay at the end of the section
    ScrollTrigger.create({
      trigger: ".rhine-terrain-section",
      start: "bottom 80%",
      end: "bottom bottom",
      scrub: true
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
    will-change: transform, opacity;
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