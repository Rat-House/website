import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const defaultTheme = 'light';
export const cookieRegex = /theme=(\w+)/g;

export function getStartingTheme() {
  if (!browser) return defaultTheme;

  const givenTheme = [...document.cookie.matchAll(cookieRegex)];
  if (givenTheme.length !== 0) {
    return givenTheme[0][1];
  }

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches &&
    localStorage.getItem('theme') === null
  ) {
    return 'dark';
  }

  return localStorage.getItem('theme') || defaultTheme;
}

const { subscribe, set, update } = writable(getStartingTheme());

subscribe((value) => {
  if (browser) {
    localStorage.setItem('theme', value);
    document.cookie = `theme=${value}; path=/; SameSite=lax; max-age=31536000;`;
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
