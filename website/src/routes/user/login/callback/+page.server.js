import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url, cookies }) {
  if (url.searchParams.get('window') !== null) return { path: '' };

  const redirectURL = `${url.origin}/user/login/callback`;
  const providerText = cookies.get('provider');
  if (providerText === undefined) {
    console.log('provider not provided');
    throw redirect(303, '/user/login');
  }
  const provider = JSON.parse(providerText);
  const close = cookies.get('windowed') === 'true';

  cookies.delete('provider', { path: '/user/login' });
  cookies.delete('windowed', { path: '/user/login' });

  const query = new URLSearchParams(url.search);
  const state = query.get('state');
  const code = query.get('code') || '';

  if (provider.state !== state) {
    console.log('state does not match expected', provider.state, state);
    throw redirect(303, '/user/login');
  }

  try {
    await locals.pb
      .collection('users')
      .authWithOAuth2Code(provider.name, code, provider.codeVerifier, redirectURL);
    // todo figure out why discord is not saving authing properly
  } catch (err) {
    console.log('Error logging in with 0Auth user', err);
  }

  let path = '/'; //todo return user to page they came from
  if (close) path = '/user/login/callback?window';

  return {
    path: path,
    authCookie: locals.pb.authStore.exportToCookie()
  };
}
