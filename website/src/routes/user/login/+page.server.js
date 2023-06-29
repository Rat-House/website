/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url, cookies }) {
  const authMethods = await locals.pb.collection('users').listAuthMethods();
  if (!authMethods) {
    return {
      authProviderRedirect: '',
      providers: []
    };
  }

  /** @type string[] */
  let providers = [];
  authMethods.authProviders.forEach((p) => {
    providers.push(p.name);
  });
  providers.sort((a, b) => a.localeCompare(b));

  const provider = (url.searchParams.get('provider') || '').toLowerCase();
  const authProvider = authMethods.authProviders.find((v) => v.name === provider);
  if (authProvider === undefined) {
    return {
      authProviderRedirect: '',
      providers: providers
    };
  }

  const redirectURL = `${url.origin}/user/login/callback`;
  const authProviderRedirect = `${authProvider.authUrl}${redirectURL}`;
  cookies.set('provider', JSON.stringify(authProvider), { path: '/user/login' });
  if (url.searchParams.get('window') !== null)
    cookies.set('windowed', 'true', { path: '/user/login' });

  return {
    authProviderRedirect: authProviderRedirect,
    providers: providers
  };
}
