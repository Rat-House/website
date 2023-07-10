<script>
  import { capitaliseOnlyFirst } from '$lib/tools.js';
  import Login from '$lib/Components/Login.svelte';
  import { enhance } from '$app/forms';
  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';

  const pages = /** @type {const} */ (['profile', 'image']);
  const pageNames = {
    profile: 'Profile',
    image: 'Images'
  };

  /**
   * @param {URL} url
   * @return string
   */
  function getPage(url) {
    return pages.find((e) => url.searchParams.get(e) !== null) ?? pages[0];
  }

  /** @type {import("./$types").PageServerData} */
  export let data;

  /** @type {String} */
  let settingsPage = getPage($page.url);

  /** @type {HTMLFormElement} */
  let uploadImage;

  afterNavigate(({ to }) => {
    if (to) settingsPage = getPage(to.url);
  });
</script>

<span>{Object.keys(data.user)}</span>
<div class="tabs justify-center">
  <div class="tab sm:tab-lifted grow sm:block hidden" />
  {#each pages as p}
    <a
      class="tab tab-bordered sm:tab-lifted {settingsPage === p ? 'tab-active' : ''}"
      data-sveltekit-replacestate
      href="?{p}">{pageNames[/** @type {typeof pages[number]} */ (p)]}</a
    >
  {/each}
  <div class="tab sm:tab-lifted grow sm:block hidden" />
</div>

{#if settingsPage === 'image'}
  <div class="flex items-center mb-4">
    <div class="avatar justify-center border-neutral rounded-full border-2">
      <div class="w-32 rounded-full">
        <img src={data.user.avatar} alt="{data.user.name}'s current avatar" />
      </div>
    </div>

    <div class="flex ml-4 gap-2 flex-col">
      <form method="post" action="?/setImage" use:enhance>
        <button
          type="submit"
          name="imageLink"
          value=""
          class="btn btn-sm btn-info"
          disabled={!data.user.avatarRaw}
          >Remove image
        </button>
      </form>
      <form
        method="post"
        action="?/setImage"
        enctype="multipart/form-data"
        class:join={!browser}
        bind:this={uploadImage}
        use:enhance
      >
        <input
          type="file"
          name="image"
          accept="image/webp,image/gif,image/svg+xml,image/png,image/jpeg"
          class="file-input file-input-sm file-input-bordered w-full max-w-xs {browser
            ? 'file-input-info'
            : 'join-item'}"
          required
          on:change={() => {
            uploadImage.requestSubmit();
          }}
        />
        <button
          class="btn btn-sm rounded-r-full btn-info join-item {browser ? 'hidden' : ''}"
          type="submit"
          >Set image
        </button>
      </form>
    </div>
  </div>

  <div class="grid grid-cols-3 w-fit gap-y-4 items-center">
    {#each data.oauthMethods as provider}
      {@const hasImage = provider in data.oauthImage}
      <h1 class="text-xl">{capitaliseOnlyFirst(provider)}:</h1>
      <form method="post" class="flex flex-col gap-1" use:enhance>
        {#if data.connectedOauthMethods.includes(provider)}
          <button
            type="submit"
            formaction="?/setImage"
            name="imageLink"
            value={data.oauthImage[provider]}
            class="btn btn-sm btn-info"
            disabled={!hasImage}
            >Set image
          </button>
          <button
            type="submit"
            name="provider"
            value={provider}
            formaction="?/unlink"
            class="btn btn-sm btn-error"
            >Unlink
          </button>
        {:else}
          <Login class="btn btn-sm btn-success" text="Link" {provider} />
        {/if}
      </form>
      <div class="avatar justify-center">
        <div class="w-16 rounded-full">
          {#if hasImage}
            <img
              src={data.oauthImage[provider]}
              alt="{data.user.name}'s from {capitaliseOnlyFirst(provider)}"
            />
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <!----------------------------------------------------------------------------->
{:else}
  e
{/if}
