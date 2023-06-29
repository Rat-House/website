import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
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
      content: sanitizeHtml(
        marked.parse(data.content, {
          headerIds: false,
          mangle: false
        })
      ),
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

/*
function toHtml(content) {
    const html =
    const doc = new DOMParser().parseFromString(html,"text/html")
    doc.for
}
*/
