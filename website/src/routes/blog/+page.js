import { pb } from '$lib/pocketbase.js';

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
  let page = parseInt(url.searchParams.get('page') || '1');
  return {
    posts: pb
      .collection('posts')
      .getList(page, 50, { filter: 'published=true', expand: 'creator,creator.authority,tags' })
  };
}
