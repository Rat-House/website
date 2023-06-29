import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
  console.log(url.searchParams);
  throw redirect(303, '/user/login/callback?window');
}
