import { Header } from '$lib/headers.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, cookies }) {
  Header.reset();
  return {
    pbCookie: cookies.serialize('pb_auth', cookies.get('pb_auth') || ''),
    user: locals.pb && locals.pb.authStore.model ? locals.pb.authStore.model.export() : undefined,
    isLoggedIn: locals.pb ? locals.pb.authStore.isValid : false,

    theme: cookies.get('theme') || ''
  };
}
