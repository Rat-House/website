/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
    return {
        isLoggedIn: locals.pb ? locals.pb.authStore.isValid : false,
    }
}