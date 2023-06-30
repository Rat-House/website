import { pb } from '$lib/pocketbase.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
  const { pbCookie } = await parent();
  pb.authStore.loadFromCookie(pbCookie);

  try {
    const data = await pb.collection('posts').getOne(params.slug, {
      expand: 'creator,editors,tags'
    });
    return {
      title: data.title,
      content: data.content,
      published: data.published
    };
  } catch {
    const data = await pb.collection('postList').getOne(params.slug);
    return {
      title: '',
      content: '',
      published: data.published
    };
  }
}
