import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';
import { cookieRegex } from '$lib/stores/theme.js';
import { open, upgrade } from "$lib/server/websocket.js";

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
  const givenTheme = [...theme.matchAll(cookieRegex)];
  if (givenTheme.length) theme = givenTheme[0][1];
  // if (theme === '') theme = defaultTheme;

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%theme%', theme)
  });

  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append(
    'set-cookie',
    event.locals.pb.authStore.exportToCookie({
      secure: new URL(event.request.url).hostname !== 'localhost',
      httpOnly: true, // false -- if can get cookie to client in ssr
      sameSite: 'Lax'
    })
  );

  return response;
}

/** @type {import("svelte-adapter-bun").WebSocketHandler} */
export const handleWebsocket = {
  open: open,
 upgrade:upgrade,
};
