import { error, redirect } from '@sveltejs/kit';

/** @type {import("./$types").PageServerLoad} */
export async function load({ locals, url, cookies }) {
  if (url.searchParams.get('window') !== null) return { path: '' };
  if (url.searchParams.get('error') !== null) {
    throw error(424, url.searchParams.get('error_description') || 'error with oath');
  }

  const redirectURL = `${url.origin}/user/login/callback`;
  const providerText = cookies.get('provider');
  if (providerText === undefined) {
    console.log('provider not provided');
    throw redirect(303, '/user/login');
  }
  const provider = JSON.parse(providerText);
  const close = cookies.get('windowed') === 'true';
  let path = cookies.get('origin') ?? '/';

  cookies.delete('provider', { path: '/user/login' });
  cookies.delete('windowed', { path: '/user/login' });
  cookies.delete('origin', { path: '/user/login' });

  const query = new URLSearchParams(url.search);
  const state = query.get('state');
  const code = query.get('code') || '';

  if (provider.state !== state) {
    console.log('state does not match expected', provider.state, state);
    throw redirect(303, '/user/login');
  }

  try {
    const user = await locals.pb
      .collection('users')
      .authWithOAuth2Code(provider.name, code, provider.codeVerifier, redirectURL);

    if (user.meta && user.meta.avatarUrl) {
      const formData = new FormData();
      const imageBlob = await fetch(user.meta.avatarUrl).then((r) => r.blob());
      formData.append('avatar', imageBlob);

      const imageFormData = new FormData();
      imageFormData.append('avatar', imageBlob);
      const updateOathImage = locals.pb
        .collection('oathUserImage')
        .getFirstListItem(`user="${user.record.id}" && provider="${provider.name}"`, {
          fields: 'id'
        })
        .then((p) => {
          (async () => {
            await locals.pb.collection('oathUserImage').update(p.id, imageFormData);
          })();
        })
        .catch(() => {
          imageFormData.append('provider', provider.name);
          imageFormData.append('user', user.record.id);
          (async () => {
            await locals.pb.collection('oathUserImage').create(imageFormData);
          })();
        });

      if (user.record.avatar === '') {
        const updateUserImage = locals.pb.collection('users').update(user.record.id, formData);
        await updateUserImage;
      }
      await updateOathImage;
    }
  } catch (err) {
    console.log('Error logging in with 0Auth user', err);
  }

  if (close) path = '/user/login/callback?window';

  return {
    path: path,
    authCookie: locals.pb.authStore.exportToCookie()
  };
}
