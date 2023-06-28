import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const pb = new PocketBase(PUBLIC_POCKETBASE_PAGEURL);
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
      )
    };
  } catch (e) {
    throw error(404, 'Not found');
  }
}
