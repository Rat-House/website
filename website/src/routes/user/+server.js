import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ locals }) {
  if (!(locals.pb && locals.pb.authStore.isValid)) throw error(401, { message: 'Not signed in' });
  const id = /** @type {import("pocketbase").Record!} */ (locals.pb.authStore.model).id;
  throw redirect(302, `/user/${id}`);
}
