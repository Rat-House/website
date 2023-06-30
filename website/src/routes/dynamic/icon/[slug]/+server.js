import { minidenticon } from 'minidenticons';

/** @type {import('./$types').RequestHandler} */
export function GET({ params }) {
  return new Response(minidenticon(params.slug), {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'max-age=31536000' }
  });
}
