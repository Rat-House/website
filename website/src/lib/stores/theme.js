import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const defaultTheme = 'light';
export const cookieRegex = /theme=(\w+)/g;

export function getStartingTheme() {
  if (!browser) return defaultTheme;

  // check if user has theme in the cookie
  const givenTheme = [...document.cookie.matchAll(cookieRegex)];
  if (givenTheme.length !== 0) {
    return givenTheme[0][1];
  }

  // no theme saved in cookie or local storage check if user wants dark mode
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches &&
    localStorage.getItem('theme') === null
  ) {
    return 'dark';
  }

  // get theme from local storage or get the default if there is nothing there
  return localStorage.getItem('theme') || defaultTheme;
}

const { subscribe, set, update } = writable(getStartingTheme());

subscribe((value) => {
  if (browser) {
    localStorage.setItem('theme', value);
    document.cookie = `theme=${value}; path=/; SameSite=lax; max-age=31536000;`;

    const html = document.querySelector('html');
    if (html) html.setAttribute('data-theme', value);
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
