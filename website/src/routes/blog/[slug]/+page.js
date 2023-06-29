import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
  const { pb } = await parent();
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
