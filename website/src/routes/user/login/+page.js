import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
  if (data.authProviderRedirect !== '') {
    throw redirect(303, data.authProviderRedirect);
  }

  return data;
}
