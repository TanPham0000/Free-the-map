<script lang="ts">
  import { onMount, tick } from "svelte";
  import gsap from "gsap";
  import europeImg from "$lib/assets/europe.png";

  let ScrollTrigger: any;
  let sectionRef: HTMLElement;
  let imageRef: HTMLImageElement;
  let wrapperRef: HTMLElement;

  onMount(async () => {
    // Dynamically import ScrollTrigger for browser environment
    const stModule = await import("gsap/dist/ScrollTrigger");
    ScrollTrigger = stModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    await tick();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef,
        start: "top top",
        end: "+=250%", // Scroll length for the zoom out effect
        scrub: 1,
        pin: true,
        onLeave: (self) => {
          // When the user scrolls past the fade to black, reset to top.
          // The strict check prevents false resets during GSAP internal refresh events.
          if (self.progress === 1 && self.direction === 1) {
            window.scrollTo({ top: 0, behavior: "instant" });
          }
        },
      },
    });

    // Start very zoomed in, as if we are still at the Rhine river
    // Assuming the Rhine is roughly in the center-left of Europe
    gsap.set(imageRef, {
      scale: 15,
      transformOrigin: "45% 55%", // Approximate position of the Rhine to zoom out from
      opacity: 1,
    });

    // Zoom out sequence
    tl.to(imageRef, {
      scale: 0.9, // Zoom out to reveal all of Europe with a bit of padding
      duration: 3,
      ease: "power2.inOut",
    })
      // Fade to black at the end
      .to(
        wrapperRef,
        {
          backgroundColor: "#000000",
          duration: 1,
        },
        "-=0.5",
      )
      .to(
        imageRef,
        {
          opacity: 0,
          duration: 1,
        },
        "-=1",
      );
  });
</script>

<section bind:this={sectionRef} class="water-cycle-section">
  <div bind:this={wrapperRef} class="zoom-wrapper">
    <img
      bind:this={imageRef}
      src={europeImg}
      alt="Europe map"
      class="europe-map"
    />
  </div>
</section>

<style>
  .water-cycle-section {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    background: #000;
  }

  .zoom-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background: #000;
  }

  .europe-map {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Cover the screen first, then scale down */
    will-change: transform, opacity;
    -webkit-mask-image: radial-gradient(
      ellipse at center,
      black 50%,
      transparent 80%
    );
    mask-image: radial-gradient(ellipse at center, black 50%, transparent 80%);
  }
</style>
