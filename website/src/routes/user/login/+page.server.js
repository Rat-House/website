/** @type {import('./$types').PageServerLoad} */
export async function load({locals, url, cookies}) {
    const authMethods = await locals.pb.collection('users').listAuthMethods();
    if (!authMethods) {
        return {
            authProviderRedirect: '',
            providers: []
        };
    }

    let providers = []
    authMethods.authProviders.forEach(p => {
        providers.push(p.name)
    })
    providers.sort((a, b) => a.localeCompare(b))

    const provider = (url.searchParams.get("provider") || "").toLowerCase()
    if (!providers.includes(provider)) {
        return {
            authProviderRedirect: "",
            providers: providers
        }
    }

    const redirectURL = `${url.origin}/user/login/callback`;
    const authProvider = authMethods.authProviders.find(v => v.name === provider);
    const authProviderRedirect = `${authProvider.authUrl}${redirectURL}`;
    cookies.set("state", authProvider.state, {path: "/user/login"})
    cookies.set("provider", JSON.stringify(authProvider), {path: "/user/login"})

    return {
        authProviderRedirect: authProviderRedirect,
        providers: providers
    };
}