<script>
  import { browser } from '$app/environment';
  import { createEventDispatcher } from 'svelte';
  import { pb } from '$lib/pocketbase.js';
  import { invalidateAll } from '$app/navigation';

  /** @type string[] */
  export let providers = [];
  const dispatcher = createEventDispatcher();

  /**
   * @param {string} provider
   */
  function authLogin(provider) {
    return () => {
      if (!browser) return;
      console.log(`logging in with ${provider}`);

      let width = 1024;
      let height = 768;

      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;

      // normalize window size
      width = width > windowWidth ? windowWidth : width;
      height = height > windowHeight ? windowHeight : height;

      let left = windowWidth / 2 - width / 2;
      let top = windowHeight / 2 - height / 2;

      window.open(
        `/user/login?provider=${provider}&window`,
        'oauth2-popup',
        `width=${width},height=${height},top=${top},left=${left},resizable,menubar=no`
      );

      // catch auth finish
      const listener = ({ key }) => {
        if (key !== 'loggedin') return;

        localStorage.removeItem('loggedin');
        dispatcher('auth');
        invalidateAll();
        window.removeEventListener('storage', listener);
      };
      window.addEventListener('storage', listener);
    };
  }
</script>

<div class="text-center">
  {#if pb.authStore.model}
    <h3>Already logged in</h3>
  {:else}
    <h4>Auth providers:</h4>
    {#key providers}
      {#each providers as provider}
        <a
          href="/user/login?provider={provider}"
          class="btn btn-accent btn-sm m-0.5"
          data-sveltekit-preload-data="tap"
          on:click|preventDefault={authLogin(provider)}>Login with {provider}</a
        >
      {/each}
    {/key}
  {/if}
</div>
