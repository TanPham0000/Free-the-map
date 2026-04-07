<script lang="ts">
  import { onMount } from "svelte";
  import type { Map } from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import { VITE_MAPBOX_API_KEY } from "$lib/config/apiKey.js";
  import gsap from "gsap";

  let ScrollTrigger: any;

  let map: Map;
  let mapContainer: HTMLElement;

  // The waypoints for our fly-through, following the river valley
  const flightPath: {
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  }[] = [
    { center: [8.63, 46.64], zoom: 15.8, pitch: 78, bearing: 50 }, // Strong beginning deep in the stream
    { center: [8.7, 46.65], zoom: 13.0, pitch: 60, bearing: 30 }, // Perfect end shot
  ];

  onMount(async () => {
    // Dynamically import ScrollTrigger for browser environment
    const stModule = await import("gsap/dist/ScrollTrigger");
    ScrollTrigger = stModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken = VITE_MAPBOX_API_KEY;

    map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/tanpham111/cmkoj8pev001n01qx4ell39fa", // Custom style with muted colors
      center: flightPath[0].center,
      zoom: flightPath[0].zoom,
      pitch: flightPath[0].pitch,
      bearing: flightPath[0].bearing,
      interactive: false,
      attributionControl: false,
      refreshExpiredTiles: false,
      maxTileCacheSize: 20,
      minZoom: 10,
      maxZoom: 18,
    });

    map.on("error", (e) => console.error("Mapbox error:", e?.error || e));

    map.on("style.load", () => {
      // 1. Add 3D Terrain
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 128,
        maxzoom: 11,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // 2. Add Atmosphere/Fog for "Nice" visuals
      map.setFog({
        range: [-0.5, 1], // Distance range for fog effect low to high
        color: "#f0f0f0", // Light gray fog color
        "horizon-blend": 0.3,
      });

      map.setLight({
        anchor: "viewport",
        color: "#ffffff",
        intensity: 0.8, // Very low intensity for a moody, cloudy day
      });

      map.addLayer({
        id: "cloud-layer",
        type: "background",
        paint: {
          "background-color": "#ffffff",
          "background-opacity": 0.4, // Makes everything look like it's under a cloud blanket
        },
      });
    });

    map.on("load", () => {
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
        anticipatePin: 0,
      },
    });

    // Animate between waypoints
    flightPath.forEach((point, i) => {
      if (i === 0) return;
      tl.to(map.getCenter(), {
        duration: 1,
        onUpdate: function () {
          // Linear interpolation handled by GSAP
          const progress = this.progress();
          const start = flightPath[i - 1];
          const end = flightPath[i];

          map.jumpTo({
            center: [
              start.center[0] + (end.center[0] - start.center[0]) * progress,
              start.center[1] + (end.center[1] - start.center[1]) * progress,
            ],
            zoom: start.zoom + (end.zoom - start.zoom) * progress,
            pitch: start.pitch + (end.pitch - start.pitch) * progress,
            bearing: start.bearing + (end.bearing - start.bearing) * progress,
          });
        },
      });
    });

    // Fade in/out the map based on scroll position
    ScrollTrigger.create({
      trigger: ".rhine-terrain-section",
      start: "top center",
      end: "bottom center",
      onEnter: () => gsap.to(".map-viewport", { opacity: 1, duration: 1 }),
      onLeave: () => {
        // Fade map to black when leaving the section
        gsap.to(".map-viewport", { opacity: 0, duration: 1 });
        // gsap.to('.fade-to-black', { opacity: 1, duration: 1 });
      },
      onEnterBack: () => {
        // Fade back in when scrolling back up
        gsap.to(".map-viewport", { opacity: 1, duration: 1 });
        // gsap.to('.fade-to-black', { opacity: 0, duration: 1 });
      },
      onLeaveBack: () => gsap.to(".map-viewport", { opacity: 0, duration: 1 }),
    });

    // Fade to black overlay at the end of the section
    ScrollTrigger.create({
      trigger: ".rhine-terrain-section",
      start: "bottom 80%",
      end: "bottom bottom",
      scrub: true,
    });

    // Elegant text reveal for cards
    const cards = gsap.utils.toArray(".card") as HTMLElement[];
    cards.forEach((card) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });

      tl.fromTo(
        card,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      ).to(
        card,
        {
          opacity: 0,
          y: -50,
          duration: 1.5, // slightly longer duration to fade out smoothly
          ease: "power1.inOut",
        },
        "+=1.5",
      ); // hold the text for a bit before fading
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
        <p>
          I am small here. I feel cold ground and soft clay. You humans call
          this my beginning. To me, it feels like waking up.
        </p>
      </div>
    </section>
    <section>
      <div class="card" id="stream-card">
        <p>
          I don’t know where I will end. I only know I cannot stand still. You
          measure me, name me, draw lines around me. I flow. That is enough.
        </p>
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
    padding: 3rem;
    max-width: 600px;
    text-align: center;
    background: transparent;
  }

  .card h2 {
    font-size: 3rem;
    letter-spacing: 4px;
    font-weight: 300;
    text-transform: uppercase;
    color: #fff;
    text-shadow:
      0 4px 15px rgba(0, 0, 0, 0.9),
      0 2px 5px rgba(0, 0, 0, 0.5);
    margin-bottom: 1.5rem;
  }

  .card p {
    font-size: 1.35rem;
    line-height: 1.8;
    color: #e0f7ff;
    text-shadow: 0 4px 15px rgba(0, 0, 0, 0.9);
  }

  #intro-card {
    text-align: center;
  }
</style>
