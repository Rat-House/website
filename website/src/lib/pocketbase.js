import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';
import PocketBase from 'pocketbase';

export const pb = new PocketBase(PUBLIC_POCKETBASE_PAGEURL);

/**
 * @param {string} cookie
 */
export function authFromCookie(cookie) {
  /* if (browser) pb.authStore.loadFromCookie(document.cookie);
  else*/
  if (!pb.authStore.isValid) pb.authStore.loadFromCookie(cookie); // not sure if this is the best idea -- https://kit.svelte.dev/docs/state-management#no-side-effects-in-load
}
