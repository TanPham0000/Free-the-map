<script lang="ts">
  import { onMount } from "svelte";
  import gsap from "gsap";
  import FloatingEllipses from "./FloatingEllipses.svelte";
  import riversImg from "$lib/assets/alle-rivieren-eu.png";

  let pRef: HTMLElement;
  let sectionRef: HTMLElement;

  onMount(async () => {
    const stModule = await import("gsap/dist/ScrollTrigger");
    const ScrollTrigger = stModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef,
        start: "top 90%", // Fade in starts early
        end: "bottom 10%", // Fade out completes late
        scrub: true,
      },
    });

    tl.fromTo(
      pRef,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
      },
    ).to(
      pRef,
      {
        opacity: 0,
        y: -50,
        filter: "blur(10px)",
        duration: 1,
        ease: "power2.in",
      },
      "+=3", // Large scrub wait time to keep text perfectly visible in the center of the screen
    );
  });
</script>

<section class="narrative-section" bind:this={sectionRef}>
  <div class="narrative-background">
    <img src={riversImg} alt="All rivers in Europe" />
  </div>
  <p bind:this={pRef}>
    <slot />
  </p>
  <FloatingEllipses />
</section>

<style>
  .narrative-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: #e0f7ff;
    overflow: hidden;
  }

  .narrative-background {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    max-width: 1200px;
    aspect-ratio: 1 / 1;
    transform: translate(-50%, -50%) rotate(8deg); /* Slightly tilted */
    opacity: 0.1; /* 10% opacity */
    z-index: 0;
    pointer-events: none;
    user-select: none;
  }

  .narrative-background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-mask-image: radial-gradient(circle, black 30%, transparent 70%);
    mask-image: radial-gradient(circle, black 30%, transparent 70%);
  }

  .narrative-section p {
    position: relative;
    z-index: 2;
    max-width: 900px;
    text-align: center;
    line-height: 2;
    margin: 0 auto;
    font-size: 1.6rem;
    font-weight: 300;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.95);
    text-shadow:
      0 0 20px rgba(0, 191, 255, 0.2),
      0 4px 15px rgba(0, 0, 0, 0.8);
  }
</style>
