<script>
  import { browser } from '$app/environment';
  import { createEventDispatcher } from 'svelte';
  import { pb } from '$lib/pocketbase.js';
  import { invalidateAll } from '$app/navigation';

  export let providers = [];
  const dispatcher = createEventDispatcher();

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

      const w = window.open(
        `/user/login?provider=${provider}&window`,
        'oauth2-popup',
        'width=' +
          width +
          ',height=' +
          height +
          ',top=' +
          top +
          ',left=' +
          left +
          ',resizable,menubar=no'
      );

      // try to catch auth finish
      const refresh = () => {
        dispatcher('auth');
        invalidateAll();
      };
      const unsub = pb.collection('users').subscribe('@oauth2', async (e) => {
        console.log(e);
        refresh();
        await (
          await unsub
        )();
      });
      w.onclose = refresh;
      pb.authStore.onChange(refresh);
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
