import { pb } from '$lib/pocketbase.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
  const { pbCookie } = await parent();
  pb.authStore.loadFromCookie(pbCookie);

  try {
    const data = await pb.collection('posts').getOne(params.slug, {
      expand: 'creator,editors,tags,creator.authority,editors.authority'
    });
    //console.log(data);
    return {
      title: data.title,
      content: data.content,
      author: data.expand.creator,
      editors: data.expand.editors,
      published: data.published
    };
  } catch {
    const data = await pb.collection('postList').getOne(params.slug);
    return {
      title: '',
      content: '',
      author: undefined,
      editors: [],
      published: data.published
    };
  }
}
