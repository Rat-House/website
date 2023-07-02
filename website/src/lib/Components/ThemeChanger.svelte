<script>
  import { onMount } from 'svelte';
  import { theme as Theme } from '$lib/stores/theme.js';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  export let theme = '';

  if (theme !== '') Theme.set(theme);
  let darkMode = $Theme === 'dark';
  let disabled = true;

  onMount(() => {
    disabled = false;

    darkMode = $Theme === 'dark';
  });

  $: Theme.set(darkMode ? 'dark' : 'light');
</script>

<form method="POST" action="/dynamic/theme/?/toggle" use:enhance>
  <input type="hidden" name="origin" value={$page.url} />
  <button type="submit" class={disabled ? '' : 'pointer-events-none'}>
    <label class="swap swap-rotate px-4">
      <!-- controls the state -->
      <input
        type="checkbox"
        bind:checked={darkMode}
        class="pointer-events-auto cursor-pointer"
        {disabled}
      />
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
  </button>
</form>
