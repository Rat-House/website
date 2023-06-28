/**
 * Creates a `POST /login` server-side endpoint
 *
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function POST({ request, locals }) {
  const { email, password } = await request.json();

  const { token, record } = await locals.pb.collection('users').authWithPassword(email, password);
  console.log('logged in', token, record);

  return new Response('Success...');
}
