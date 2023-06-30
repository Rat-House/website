import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase.js';

/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
  const { isLoggedIn, pbCookie, user } = await parent();
  if (!isLoggedIn || user === undefined) throw error(401, { message: 'Not signed in' });
  pb.authStore.loadFromCookie(pbCookie);

  /** @type {Promise<String>} */
  let userAuth = pb
    .collection('authorities')
    .getOne(user.authority)
    .then(/** @type {import("../../../dbtypes.js").Authority}*/ (r) => r.name)
    .catch(() => 'User');

  return {
    authorityName: userAuth
  };
}
