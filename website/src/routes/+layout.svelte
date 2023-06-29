<script>
    import '../app.css';
    import {onMount} from 'svelte';
    import {themeChange} from 'theme-change';
    import {invalidateAll} from "$app/navigation";
    import Login from "$lib/Components/Login.svelte";

    /** @type {import('./$types').LayoutData} */
    export let data;

    onMount(() => {
        themeChange(false);
    });

    function logout(){
      data.auth.clear(); //todo make login/out use actions
      invalidateAll()
    }

    let loginModal;
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
                        <li><a href="#?">About</a></li>
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
                        <li><a href="#?">About</a></li>
                    </ul>
                </div>
                {#if !data.pb.authStore.isValid}
                    <button class="btn btn-accent btn-sm" on:click={()=>loginModal.showModal()}>login</button>
                {:else}
                    <button class="btn btn-accent btn-sm" on:click={logout}>Logout</button> <!--todo replace with user info dropdown-->
                {/if}
                <label class="swap swap-rotate px-4">
                    <!-- controls the state -->
                    <input type="checkbox" data-toggle-theme="dark,light" data-act-class="ACTIVECLASS"/>
                    <!-- Light-->
                    <svg class="swap-on fill-current w-10 h-10" viewBox="0 0 24 24">
                        <path
                                d="m5.64 17-.71.71a1 1 0 0 0 0 1.41 1 1 0 0 0 1.41 0l.71-.71A1 1 0 0 0 5.64 17ZM5 12a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Zm7-7a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1ZM5.64 7.05a1 1 0 0 0 .7.29 1 1 0 0 0 .71-.29 1 1 0 0 0 0-1.41l-.71-.71a1 1 0 0 0-1.41 1.41Zm12 .29a1 1 0 0 0 .7-.29l.71-.71a1 1 0 1 0-1.41-1.41l-.64.71a1 1 0 0 0 0 1.41 1 1 0 0 0 .66.29ZM21 11h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Zm-9 8a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1Zm6.36-2A1 1 0 0 0 17 18.36l.71.71a1 1 0 0 0 1.41 0 1 1 0 0 0 0-1.41ZM12 6.5a5.5 5.5 0 1 0 5.5 5.5A5.51 5.51 0 0 0 12 6.5Zm0 9a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5Z"
                        />
                    </svg>
                    <!-- Dark-->
                    <svg class="swap-off fill-current w-10 h-10" viewBox="0 0 24 24">
                        <path
                                d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05Zm-9.5 6.69A8.14 8.14 0 0 1 7.08 5.22v.27a10.15 10.15 0 0 0 10.14 10.14 9.79 9.79 0 0 0 2.1-.22 8.11 8.11 0 0 1-7.18 4.32Z"
                        />
                    </svg>
                </label>
            </div>
        </div>
    </header>

    <main>
        <slot/>
    </main>

    <footer
            class="footer sticky top-[100vh] items-center p-4 bg-base-300 pointer-events-none select-none"
    >
        <div class="items-center grid-flow-col">
            <img src="/house.png" width="50" class="filter-none dark:invert" alt="website icon"/>
            <p>Copyright © 2023 - All right reserved</p>
        </div>
    </footer>
</section>

<dialog bind:this={loginModal} class="modal">
    <form method="dialog" class="modal-box">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        <Login on:auth={()=>loginModal.close()} pocketBase={data.pb}/>
        <div class="pb-4"></div>
    </form>
    <form method="dialog" class="modal-backdrop">
        <button tabindex="-1">close</button>
    </form>
</dialog>
