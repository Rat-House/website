import { error } from '@sveltejs/kit';

/**
 * @typedef {import("../../../../dbtypes.d").Authority} Authority
 * @typedef {import("../../../../dbtypes.d").User} User
 * @typedef {import("../../../../dbtypes.d").Post} Post
 */

/** @type {import("./$types").PageLoad} */
export async function load({ params, locals }) {
  if (!locals.pb.authStore.model) throw error(401, 'Not logged in');
  const authLevel = await locals.pb
    .collection('authorities')
    .getOne(locals.pb.authStore.model.authority, {
      fields: 'level'
    })
    .then(/** @param {Authority}r */ (r) => r.level);
  if (authLevel < 1) throw error(403, 'Insufficient perms');

  /** @type{Post} */
  let blogpost;
  // dont allow random urls
  if (params.slug !== 'new') {
    try {
      blogpost = /** @type{Post} */ await locals.pb
        .collection('posts')
        .getOne(params.slug, {
          fields: 'id,title,content,published'
        });
    } catch (e) {
      if (e.status === 404) throw error(404, 'Blogpost not found');
      throw e;
    }
  }

  return {
    blogId: blogpost?.id ?? '',
    title: blogpost?.title ?? '',
    content: blogpost?.content ?? '',
    published: blogpost?.published ?? false
  };
}

/** @type {import("./$types").Actions} */
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
