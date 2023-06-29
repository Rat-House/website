<script>
  import { browser } from '$app/environment';
  import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';
  import { invalidateAll } from '$app/navigation';
  import { createEventDispatcher } from 'svelte';
  import { currentUser, pb } from '$lib/pocketbase.js';

  const dispatcher = createEventDispatcher();

  async function getAuthMethods() {
    const methods = await pb.collection('users').listAuthMethods();
    let providers = [];
    methods.authProviders.forEach((p) => {
      providers.push(p);
    });
    providers.sort((a, b) => a.name.localeCompare(b.name));
    return providers;
  }

  function authLogin(provider) {
    return () => {
      if (!browser) return;
      console.log(`logging in with ${provider}`);

      const authData = {
        provider: provider,
        redirectUrl: `${PUBLIC_POCKETBASE_PAGEURL}/api/oauth2-redirect`
      };
      if (provider === 'discord') {
        authData.scopes = ['identify', 'email'];
      }

      pb.collection('users')
        .authWithOAuth2(authData)
        .then(() => {
          if (pb.authStore.isValid) invalidateAll();
          dispatcher('auth', pb.authStore);

          // console.log(pocketBase.authStore.isValid);
          // console.log(pocketBase.authStore.token);
          // console.log(pocketBase.authStore.model.id);
        });
    };
  }
</script>

<div class="text-center">
  {#if $currentUser}
    <h3>Already logged in</h3>
  {:else}
    <h4>Auth providers:</h4>
    {#await getAuthMethods()}
      <span>loading...</span>
    {:then providers}
      {#each providers as provider (provider.name)}
        <button on:click={authLogin(provider.name)} class="btn btn-accent btn-sm m-0.5"
          >{provider.name}</button
        >
      {/each}
    {/await}
  {/if}
</div>
