<script lang="ts">
  import { onMount } from 'svelte';
</script>

<div class="content">
  
  <div class="links">
    <a href="/" class="link">Clickable Link 1</a>
    <a href="/" class="link">Clickable Link 2</a>
    <button class="button">Clickable Button</button>
    <a href="/" class="link">Another Link</a>
  </div>
</div>

<style>
  .content {
    position: relative;
    z-index: 1;
    padding: 2rem;
    color: white;
    min-height: 100vh;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .links {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .link, .button {
    display: inline-block;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    text-decoration: none;
    font-size: 1.1rem;
    transition: background 0.3s ease;
    width: fit-content;
  }

  .link:hover, .button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .button {
    cursor: pointer;
  }
  
  :global(body) {
    background: black;
  }
  
</style>
