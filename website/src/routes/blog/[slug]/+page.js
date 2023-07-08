/**
 * @typedef {import("../../../dbtypes.js").User} User
 * @typedef {import("../../../dbtypes.js").Post} Post
 */

import { authFromCookie, pb } from '$lib/pocketbase.js';
import { renderMarkdown } from '$lib/Components/markdownitParser.js';
import { HeaderBuilder } from '$lib/headers.js';
import { error } from '@sveltejs/kit';

/** @type {import("./$types").PageLoad} */
export async function load({ params, parent }) {
  const {pbCookie, user} = await parent()
  authFromCookie(pbCookie);

  /** @type {Promise<number>} */
  let userAuth = new Promise((resolve) => {
    if (user)
      pb.collection('authorities')
        .getOne(user.authority)
        .then(/** @type {Authority}*/ (r) => resolve(r.level))
        .catch(() => resolve(0));
    else resolve(0);
  });

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

    const created = new Date(data.datePublished || data.created);
    let updated = new Date(data.updated);
    if (created>updated || ((updated-created)<1000)) updated = created;
    return {
      title: data.title,
      content: data.content,
      initialMarkdown: renderMarkdown(data.content, pb),
      created: created,
      edited: updated,
      author: author,
      editors: editors,
      lastEditor: lastEditor,
      published: data.published,

      userAuth
    };
  } catch {
    try {
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
        published: data.published,

        userAuth
      };
    } catch {
      throw error(404, 'Blogpost not found');
    }
  }
}
