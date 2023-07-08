import { error } from '@sveltejs/kit';

/**
 * @typedef {import("../../../../dbtypes.d").Authority} Authority
 * @typedef {import("../../../../dbtypes.d").User} User
 * @typedef {import("../../../../dbtypes.d").Post} Post
 */

/** @type {import("./$types").PageServerLoad} */
export async function load({ params, locals }) {
  if (!locals.pb.authStore.model) throw error(401, 'Not logged in');
  const authLevel = await locals.pb
    .collection('authorities')
    .getOne(locals.pb.authStore.model.authority, {
      fields: 'level'
    })
    .then((r) => /** @type {Authority} */ (r).level);
  if (authLevel < 1) throw error(403, 'Insufficient perms');

  /** @type{Post|undefined} */
  let blogpost;
  // dont allow random urls
  if (params.slug !== 'new') {
    try {
      blogpost = /** @type{Post} */ await locals.pb.collection('posts').getOne(params.slug, {
        fields: 'id,title,content,published'
      });
    } catch (e) {
      if (
        'status' in /** @type {Object} */ (e) &&
        /** @type {import("pocketbase").ClientResponseError} */ (e).status === 404
      )
        throw error(404, 'Blogpost not found');
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
    const formData = await request.formData();

    const blogId = (formData.get('blogId') ?? '').toString();
    const title = (formData.get('title') ?? '').toString();
    const content = (formData.get('content') ?? '').toString();
    const publish = (formData.get('save') ?? '').toString() === 'publish';
    const sender = locals.pb.authStore.model.id;

    /**
     * @typedef {{published: boolean, title: string, content: string, creator: string|undefined, editors: Array.<string>|undefined, datePublished: string|undefined, }} NewPost
     * @type {NewPost}
     */
    const data = /** @type {NewPost} */ {
      title: title,
      content: content,
      // "tags": [
      //   "RELATION_RECORD_ID"
      // ],
      published: publish,

      editors: undefined,
      creator: undefined,
      datePublished: undefined
    };

    try {
      if (blogId === '') {
        if (publish) data.datePublished = new Date().toISOString();
        data.creator = sender;
      } else {
        const { editors, published } = await locals.pb
          .collection('posts')
          .getOne(blogId, { fields: 'editors,published' })
          .then((r) => {
            return {
              editors: /** @type {Post} */ (r).editors,
              published: /** @type {Post} */ (r).published
            };
          });

        const index = editors.indexOf(sender);
        if (index > -1) {
          editors.splice(index, 1);
        }
        editors.push(sender);
        data.editors = editors;
        if (publish && !published) data.datePublished = new Date().toISOString();
      }

      if (!publish) data.datePublished = '';

      /** @type {Post} */
      let record;
      // update
      if (blogId !== '') {
        record = /** @type {Post} */ await locals.pb.collection('posts').update(blogId, data);
      }
      // new post
      else {
        record = /** @type {Post} */ await locals.pb.collection('posts').create(data);
      }

      return {
        blogId: record.id
      };
    } catch (e) {
      return {
        error: /** @type {Error} */ (e).message,
        title: title,
        content: content
      };
    }
  }
};
