/**
 * @typedef {import("../../dbtypes.js").Authority} Authority
 */

import { authFromCookie, pb } from '$lib/pocketbase.js';

/** @type {import('./$types').PageLoad} */
export async function load({ url, parent }) {
  const page = parseInt(url.searchParams.get('page') || '1');
  const viewAll = url.searchParams.get('all') != null;

  const { user, pbCookie } = await parent();
  authFromCookie(pbCookie);

  /**@type {import('pocketbase').RecordListQueryParams} */
  const params = {
    expand: 'creator,creator.authority,tags',
    sort: '-created'
  };
  if (!viewAll) params.filter = 'published=true';

  /** @type {Promise<number>} */
  let userAuth = new Promise((resolve) => {
    if (user)
      pb.collection('authorities')
        .getOne(user.authority)
        .then(/** @type {Authority}*/ (r) => resolve(r.level))
        .catch(() => resolve(0));
    else resolve(0);
  });

  return {
    posts:
      /** @type {Promise<Array.<import("../../../dbtypes.js").Post>>} */
      pb.collection('posts').getList(page, 50, params),
    authorityLevel: userAuth,
    showAll: viewAll
  };
}
