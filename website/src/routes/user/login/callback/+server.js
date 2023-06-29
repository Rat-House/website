import {redirect} from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({locals, url, cookies}) {
    const redirectURL = `${url.origin}/user/login/callback`;
    const expectedState = cookies.get('state');
    const provider = JSON.parse(cookies.get('provider'))

    cookies.delete("state", {path: "/user/login"})
    cookies.delete("provider", {path: "/user/login"})

    const query = new URLSearchParams(url.search);
    const state = query.get('state');
    const code = query.get('code');

    if (expectedState !== state) {
        console.log('state does not match expected', expectedState, state);
        throw redirect(303, '/user/login');
    }

    console.log(code)
    try {
        await locals.pb
            .collection('users')
            .authWithOAuth2Code(provider.name, code || '', provider.codeVerifier, redirectURL);
    } catch (err) {
        console.log('Error logging in with 0Auth user', err);
    }

    throw redirect(303, '/'); //todo return user to page they came from
}
