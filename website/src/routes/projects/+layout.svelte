<script>
  import { browser } from '$app/environment';
</script>

{#if browser}
  <slot />
{:else}
  this page requires js to work
{/if}
