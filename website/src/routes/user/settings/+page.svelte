<script>
  import { capitaliseOnlyFirst } from '$lib/tools.js';
  import Login from '$lib/Components/Login.svelte';
  import { enhance } from '$app/forms';
  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import FloatingLabel from '$lib/Components/FloatingLabel.svelte';

  const pages = /** @type {const} */ (['profile', 'oath', 'image']);
  const pageNames = {
    profile: 'Profile',
    image: 'Images',
    oath: 'Oath Providers'
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

  /** @type {Set.<string>} */
  let changed = new Set();
  let anyChange = !browser;

  /** @param {Event} event */
  function changeWatcher(event) {
    if (event.target === null) return;
    changed.add(/** @type {HTMLFormElement} */ (event.target).name);
    anyChange = changed.size !== 0;
  }

  afterNavigate(({ to }) => {
    if (to) settingsPage = getPage(to.url);
  });
</script>

<!--<span>{Object.keys(data.user)}</span>-->
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
      {@const linked = data.connectedOauthMethods.includes(provider)}
      {@const hasImage = provider in data.oauthImage && linked}
      <h1 class="text-xl">{capitaliseOnlyFirst(provider)}:</h1>
      <form method="post" use:enhance>
        {#if linked}
          <button
            type="submit"
            formaction="?/setImage"
            name="imageLink"
            value={data.oauthImage[provider]}
            class="btn btn-sm btn-info"
            disabled={!hasImage}
            >Set image
          </button>
        {:else}
          <h1 class="uppercase text-sm font-bold">Not linked</h1>
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
{:else if settingsPage === 'oath'}
  <div>
    {#each data.oauthMethods as provider}
      <div class="flex w-fit first:mt-0 mt-4 items-center">
        <form method="post" use:enhance>
          {#if data.connectedOauthMethods.includes(provider)}
            <button
              type="submit"
              name="provider"
              value={provider}
              formaction="?/unlink"
              class="btn btn-sm btn-error inline-flex"
            >
              <span>Unlink {capitaliseOnlyFirst(provider)}</span>
              <span>
                {#if provider in data.oauthImage}
                  <div class="avatar justify-center">
                    <div class="w-6 rounded-full">
                      <img
                        src={data.oauthImage[provider]}
                        alt="{data.user.name}'s from {capitaliseOnlyFirst(provider)}"
                      />
                    </div>
                  </div>
                {/if}
              </span>
            </button>
          {:else}
            <Login
              class="btn btn-sm btn-success"
              text="Link {capitaliseOnlyFirst(provider)}"
              {provider}
            />
          {/if}
        </form>
      </div>
    {/each}
  </div>
  <!----------------------------------------------------------------------------->
{:else}
  <form
    action="?{settingsPage}&/updateProfile"
    method="post"
    use:enhance={({ formData }) => {
      for (let entry of formData.entries()) if (!changed.has(entry[0])) formData.delete(entry[0]);

      return async ({ update }) => {
        changed.forEach((e) => changed.delete(e));
        anyChange = false;
        await update({ reset: false });
      };
    }}
  >
    <FloatingLabel>
      <label slot="label" for="name">Name</label>
      <input
        slot="field"
        id="name"
        name="name"
        type="text"
        value={data.user.name}
        maxlength="256"
        placeholder=" "
        on:input={changeWatcher}
      />
    </FloatingLabel>

    <FloatingLabel>
      <label slot="label" for="bio">Bio</label>
      <textarea
        slot="field"
        class="textarea-lg"
        id="bio"
        name="bio"
        rows="5"
        on:input={changeWatcher}
        placeholder=" ">{data.user.bio}</textarea
      >
    </FloatingLabel>

    <button type="submit" class="btn mt-2" disabled={!anyChange}>Update</button>
  </form>
{/if}
