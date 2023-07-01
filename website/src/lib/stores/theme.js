import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const defaultMode = 'light';

function getStartingTheme() {
  if (!browser) return defaultMode;

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches &&
    localStorage.getItem('theme') === null
  ) {
    return 'dark';
  }

  return localStorage.getItem('theme') || defaultMode;
}

const { subscribe, set, update } = writable(getStartingTheme());

subscribe((value) => {
  if (browser) {
    // localStorage.setItem("theme",value)
    document.cookie = `theme=${value}; path=/; SameSite=lax; max-age=31536000`;
  }
});

/**
 * @type {import("svelte/store").Writable<string>}
 */
export const theme = {
  subscribe,
  set,
  update
};
