<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  let container;

  onMount(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 1. CREATE THE LANDSCAPE
    const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
    const material = new THREE.MeWshStandardMaterial({ 
      color: 0xffffff, // White mountains
      wireframe: true,  // Stylized "Blueprint/Grid" look
      displacementScale: 0 // Start flat
    });

    // Load the heightmap
    const loader = new THREE.TextureLoader();
    loader.load('/path-to-your-swiss-heightmap.png', (t) => {
      material.displacementMap = t;
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2; // Lay it flat
    scene.add(mesh);

    // 2. LIGHTING (For the B&W shadows)
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.set(0, 5, 10);

    // 3. THE GSAP FLY-THROUGH
    gsap.to(material, {
      displacementScale: 3, // Mountains "rise"
      scrollTrigger: {
        trigger: ".trigger-element", // A div in your main page
        scrub: true,
      }
    });

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  });
</script>

<div bind:this={container} class="canvas-wrapper"></div>

<style>
  .canvas-wrapper {
    width: 100%;
    height: 400px; /* Small section height */
    background: #000;
  }
</style>