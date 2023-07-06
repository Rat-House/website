import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase.js';

/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
  if (data.authProviderRedirect !== '') {
    throw redirect(303, data.authProviderRedirect);
  }

  if (!browser) pb.authStore.clear();

  return data;
}
