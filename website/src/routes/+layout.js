import { pb } from '$lib/pocketbase.js';
import { browser } from '$app/environment';

/** @type {import('./$types').LayoutLoad} */
export async function load({ data }) {
  if (browser) pb.authStore.loadFromCookie(document.cookie);
  else pb.authStore.loadFromCookie(data.pbCookie); // not sure if this is the best idea -- https://kit.svelte.dev/docs/state-management#no-side-effects-in-load

  return data;
}
