<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  onMount(() => {
    if (browser) localStorage.setItem('loggedin', 'true');
    window.close();
  });
</script>

<div class="text-center mt-40">
  <h3 class="text-lg font-bold">Auth completed.</h3>
  <h5>You can go back to the app if this window is not automatically closed.</h5>
</div>
