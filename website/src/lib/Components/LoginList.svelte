<script>
  import { pb } from "$lib/pocketbase.js";
  import Login from "$lib/Components/Login.svelte";

  /** @type string[] */
  export let providers = [];
</script>

<div class="text-center">
  {#if pb.authStore.model}
    <h3>Already logged in</h3>
  {:else}
    <h4>Auth providers:</h4>
    {#key providers}
      {#each providers as provider}
        <Login {provider} on:auth />
      {/each}
    {/key}
  {/if}
</div>
