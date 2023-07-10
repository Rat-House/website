<script>
  import { capitaliseOnlyFirst } from "$lib/tools.js";
  import Login from "$lib/Components/Login.svelte";
  import { enhance } from "$app/forms";

  /** @type {import("./$types").PageServerData} */
  export let data;
</script>

{Object.keys(data.user)}
<br />
<div class="grid grid-cols-3 w-fit gap-y-4 items-center">
  {#each data.oauthMethods as provider}
    {@const hasImage = (provider in data.oauthImage)}
    <h1 class="text-xl">{capitaliseOnlyFirst(provider)}:</h1>
    <form method="post" class="flex flex-col gap-1" use:enhance>
      {#if data.connectedOauthMethods.includes(provider)}
        <button type="submit" formaction="?/setImage"
                name="imageLink"
                value={data.oauthImage[provider]}
                class="btn btn-sm btn-info"
                disabled={!hasImage}>Set image
        </button>
        <button type="submit"
                name="provider"
                value={provider}
                formaction="?/unlink" class="btn btn-sm btn-error">Unlink
        </button>
      {:else}
        <Login class="btn btn-sm btn-success" text="Link" provider={provider} />
      {/if}
    </form>
    <div class="avatar justify-center">
      <div class="w-16 rounded-full">
        {#if hasImage}
          <img src={data.oauthImage[provider]} alt="{data.user.name}'s from {capitaliseOnlyFirst(provider)}">
        {/if}
      </div>
    </div>
  {/each}
</div>
