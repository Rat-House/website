import { redirect } from '@sveltejs/kit';
import { invalidateAll } from '$app/navigation';
import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase.js';

/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
  if (data.path === '') return;

  if (browser) {
    localStorage.setItem('loggedin', 'true');
    pb.authStore.loadFromCookie(data.authCookie || '');
    console.log(pb.authStore);
    pb.authStore.save(pb.authStore.token, pb.authStore.model);
    invalidateAll();
  }
  throw redirect(303, data.path);
}
