/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request, locals }) {
  if (!locals.pb.authStore.isValid) return new Response('Not logged in', { status: 401 });

  let data;
  try {
    let { title, body, tags, draft } = request.json();
    data = {
      title: title,
      content: body,
      tags: tags,
      creator: locals.pb.authStore.model.id,
      published: !draft
    };
  } catch {
    return new Response('missing args', { status: 400 });
  }

  return new Promise((resolve) => {
    locals.pb
      .collection('posts')
      .create(data)
      .then(() => {
        resolve(new Response('success'));
      })
      .catch((e) => {
        console.log(e);
        resolve(new Response('error'));
      });
  });
}
