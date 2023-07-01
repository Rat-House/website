import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';

/** @type {import("@sveltejs/kit").Handle} */
export async function handle({ event, resolve }) {
  event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_PAGEURL);

  // load the store data from the request cookie string
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    if (event.locals.pb.authStore.isValid) await event.locals.pb.collection('users').authRefresh();
  } catch (_) {
    // clear the auth store on failed refresh
    event.locals.pb.authStore.clear();
  }

  let theme = event.request.headers.get('cookie') || '';
  const givenTheme = [...theme.matchAll(/theme=(\w+)/g)];
  if (givenTheme.length) theme = givenTheme[0][1];
  if (theme === '') theme = 'light';

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%theme%', theme)
  });

  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append(
    'set-cookie',
    event.locals.pb.authStore.exportToCookie({
      secure: new URL(event.request.url).hostname !== 'localhost',
      httpOnly: true,
      sameSite: 'Lax'
    })
  );

  return response;
}
