/**
 * @typedef {import("../../../dbtypes.js").User} User
 * @typedef {import("../../../dbtypes.js").Post} Post
 */

import { authFromCookie, pb } from '$lib/pocketbase.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
  authFromCookie((await parent()).pbCookie);

  //todo make auths table in authority collection

  try {
    const data = /** @type {Post} */ await pb.collection('posts').getOne(params.slug, {
      expand: 'creator,editors,tags,creator.authority,editors.authority'
    });
    //console.log(data);
    return {
      title: data.title,
      content: data.content,
      author: /** @type {User} */ data.expand.creator,
      editors: /** @type {Array.<User>} */ data.expand.editors,
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
