<script>
  import { browser } from '$app/environment';

  let js = false;
  if (browser) {
    js = true;
  }
</script>

{#if js}
  <slot />
{:else}
  this page requires js to work
{/if}
