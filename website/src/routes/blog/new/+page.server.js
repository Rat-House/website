/** @type {import('./$types').Actions} */
export const actions = {
  post: async ({ request, locals }) => {
    if (!locals.pb.authStore.isValid || !locals.pb.authStore.model)
      return new Response('Not logged in', { status: 401 });

    /**
     * @type {Object.<string,*>} todo
     */
    let data;
    try {
      let formData = await request.formData();
      data = {
        title: formData.get('title'),
        content: formData.get('body'),
        tags: formData.get('tags'),
        creator: locals.pb.authStore.model.id,
        published: formData.get('draft') === 'false'
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
};
