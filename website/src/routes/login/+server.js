/**
 * Creates a `POST /login` server-side endpoint
 *
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function POST({ request, locals }) {
  const { email, password } = await request.json();

  const { token, record } = await locals.pb.collection('users').authWithPassword(email, password);

  return new Response('Success...');
}