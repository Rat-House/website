import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ locals }) {
  if (!(locals.pb && locals.pb.authStore.isValid)) throw error(401, { message: 'Not signed in' });
  const id = /** @type {import("pocketbase").Record!} */ (locals.pb.authStore.model).id;
  throw redirect(302, `/user/${id}`);
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals, url, setHeaders }) {
  if (url.searchParams.get('/logout') === null) {
    setHeaders({ allow: '?/logout' });
    throw error(405, 'this action is not supported');
  }
  const data = await request.formData();
  locals.pb.authStore.clear();
  throw redirect(303, data.get('origin') ?? '/');
}
