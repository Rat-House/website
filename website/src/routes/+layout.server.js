/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, cookies }) {
  return {
    pbCookie: cookies.serialize('pb_auth', cookies.get('pb_auth') || ''),
    user: locals.pb && locals.pb.authStore.model ? locals.pb.authStore.model.export() : {},
    isLoggedIn: locals.pb ? locals.pb.authStore.isValid : false
  };
}
