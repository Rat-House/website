<script>
  import '../app.css';
  import { MetaTags } from 'svelte-meta-tags';
  import Login from '$lib/Components/Login.svelte';
  import { pb } from '$lib/pocketbase';
  import { enhance } from '$app/forms';
  import { getAvatarUrl } from '$lib/tools.js';
  import ThemeChanger from '$lib/Components/ThemeChanger.svelte';
  import { Header } from '$lib/headers.js';
  import { navigating, page } from '$app/stores';
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import Navlink from '$lib/Components/Navlink.svelte';

  /** @type {import("./$types").LayoutData} */
  export let data;

  /** @type string[] */
  let providers = [];
  /** @type HTMLDialogElement */
  let loginModal;

  async function getProviders() {
    if (providers.length !== 0) return providers;
    await pb
      .collection('users')
      .listAuthMethods()
      .then((methods) => {
        methods.authProviders.forEach((p) => {
          providers.push(p.name);
        });
        providers.sort((a, b) => a.localeCompare(b));
      });
    return providers;
  }

  function preppedHeader() {
    return Header.updateUrl($page.url).setImage(
      `${$page.url.origin}/favicon-128.png`,
      'website logo'
    );
  }

  let headers = preppedHeader().export();

  $: if (
    $navigating &&
    $navigating.to &&
    $navigating.from &&
    $navigating.to.route.id !== $navigating.from.route.id
  ) {
    headers = preppedHeader().export();
    Header.reset();
  }
</script>

<svelte:head>
  <meta name="theme-color" content="#0E0F29" />
</svelte:head>

<MetaTags {...headers} />

<section class="min-h-screen">
  <header>
    <div class="navbar bg-base-100">
      <div class="navbar-start">
        <a class="btn btn-ghost normal-case text-xl" href="/">
          <img
            src="/FullLogo.png"
            width="200"
            class="filter-none dark:invert pointer-events-none"
            alt="website logo"
          />
        </a>
      </div>
      <div class="navbar-end">
        <div class="dropdown">
          <button class="btn btn-ghost lg:hidden">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
          <ul
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><Navlink href="/blog">Blog</Navlink></li>
            <li><Navlink href="/projects">Projects</Navlink></li>
            <li><Navlink href="/contact">Contact us</Navlink></li>
            <li><Navlink href="/about">About</Navlink></li>
          </ul>
        </div>
        <div class="hidden lg:flex">
          <ul class="menu menu-horizontal px-1">
            <li><Navlink href="/blog">Blog</Navlink></li>
            <li><Navlink href="/projects">Projects</Navlink></li>
            <li><Navlink href="/contact">Contact us</Navlink></li>
            <li><Navlink href="/about">About</Navlink></li>
          </ul>
        </div>
        {#if data.isLoggedIn}
          {@const user = /** @type {import("../dbtypes.js").User} */ (data.user)}
          <a href="/user/{user.id}">
            <div class="avatar">
              <div class="w-9 rounded-full">
                <img
                  src={getAvatarUrl(user, '128x128')}
                  width="128"
                  height="128"
                  alt="{user.name}'s icon"
                />
              </div>
            </div>
          </a>
          <form
            method="POST"
            action="/user?/logout"
            use:enhance={async ({ cancel, action, formData }) => {
              cancel();
              pb.authStore.clear();
              await fetch(action, { method: 'POST', body: formData });
              await invalidateAll();
            }}
          >
            <input type="hidden" name="origin" value={$page.url} />
            <button class="btn btn-accent btn-sm">Log out</button>
          </form>
        {:else}
          <a
            class="btn btn-accent btn-sm"
            href={browser ? '' : `/user/login?origin=${encodeURIComponent($page.url.toString())}`}
            on:click|preventDefault={() => loginModal.showModal()}>login</a
          >
        {/if}
        <ThemeChanger theme={data.theme} />
      </div>
    </div>
  </header>

  <main>
    <slot />
  </main>

  <footer
    class="footer sticky top-[100vh] items-center p-4 bg-base-300 pointer-events-none select-none"
  >
    <div class="items-center grid-flow-col">
      <img src="/house.png" width="50" class="filter-none dark:invert" alt="website icon" />
      <p>Copyright © 2023 - All right reserved</p>
    </div>
  </footer>
</section>

{#if !data.isLoggedIn}
  <dialog bind:this={loginModal} class="modal">
    <form method="dialog" class="modal-box">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      {#await getProviders()}
        loading providers...
      {:then providers}
        <Login {providers} on:auth={() => loginModal.close()} />
      {/await}
      <div class="pb-4" />
    </form>
    <form method="dialog" class="modal-backdrop">
      <button tabindex="-1">close</button>
    </form>
  </dialog>
{/if}
