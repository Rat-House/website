<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import Login from '$lib/Components/Login.svelte';
  import { pb } from '$lib/pocketbase';
  import { applyAction, enhance } from '$app/forms';
  import { getAvatarUrl } from '$lib/tools.js';
  import ThemeChanger from '$lib/Components/ThemeChanger.svelte';

  /** @type {import("./$types").LayoutData} */
  export let data;

  /** @type string[] */
  let providers = [];
  /** @type HTMLDialogElement */
  let loginModal;

  onMount(() => {
    pb.collection('users')
      .listAuthMethods()
      .then((methods) => {
        methods.authProviders.forEach((p) => {
          providers.push(p.name);
        });
        providers = providers.sort((a, b) => a.localeCompare(b));
      });
  });
</script>

<section class="min-h-screen">
  <header>
    <div class="navbar bg-base-100">
      <div class="navbar-start">
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
            <li><a href="/blog">Blog</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
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
        <div class="hidden lg:flex">
          <ul class="menu menu-horizontal px-1">
            <li><a href="/blog">Blog</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        {#if data.isLoggedIn}
          {@const user = /** @type {import("../dbtypes.js").User} */ (data.user)}
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

          <form
            method="POST"
            action="/user/logout"
            use:enhance={() => {
              return async ({ result }) => {
                pb.authStore.clear();
                await applyAction(result);
              };
            }}
          >
            <button class="btn btn-accent btn-sm">Log out</button>
          </form>
        {:else}
          <a
            class="btn btn-accent btn-sm"
            href="/user/login"
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
      <Login {providers} on:auth={() => loginModal.close()} />
      <div class="pb-4" />
    </form>
    <form method="dialog" class="modal-backdrop">
      <button tabindex="-1">close</button>
    </form>
  </dialog>
{/if}
