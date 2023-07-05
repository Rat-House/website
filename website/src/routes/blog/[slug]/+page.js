/**
 * @typedef {import("../../../dbtypes.js").User} User
 * @typedef {import("../../../dbtypes.js").Post} Post
 */

import { authFromCookie, pb } from '$lib/pocketbase.js';
import { renderMarkdown } from '$lib/Components/markdownitParser.js';
import { HeaderBuilder } from '$lib/headers.js';

/** @type {import("./$types").PageLoad} */
export async function load({ params, parent }) {
  authFromCookie((await parent()).pbCookie);

  //todo make auths table in authority collection

  try {
    const data = /** @type {Post} */ await pb.collection('posts').getOne(params.slug, {
      expand: 'creator,editors,tags,creator.authority,editors.authority'
    });

    const author = /** @type {User} */ data.expand.creator;
    const editors = /** @type {Array.<User>|User} */ data.expand.editors || [];
    let lastEditor = author;
    if (Array.isArray(editors) && editors.length > 0) lastEditor = editors[editors.length - 1];
    else if (editors !== undefined && !Array.isArray(editors)) lastEditor = editors;

    new HeaderBuilder().setTitle(data.title).setDescription('A blogpost').save();

    return {
      title: data.title,
      content: data.content,
      initialMarkdown: renderMarkdown(data.content, pb),
      created: new Date(data.created),
      edited: new Date(data.updated),
      author: author,
      editors: editors,
      lastEditor: lastEditor,
      published: data.published
    };
  } catch {
    const data = await pb.collection('postList').getOne(params.slug);
    return {
      title: '',
      content: '',
      initialMarkdown: '',
      created: new Date(0),
      edited: new Date(0),
      author: undefined,
      editors: [],
      lastEditor: undefined,
      published: data.published
    };
  }
}
