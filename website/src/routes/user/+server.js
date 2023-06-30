import { error, redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase.js';

/** @type {import('./$types').RequestHandler} */
export function GET({ locals }) {
  if (!(locals.pb && locals.pb.authStore.isValid)) throw error(401, { message: 'Not signed in' });
  throw redirect(302, `/user/${locals.pb.authStore.model.id}`);
}
