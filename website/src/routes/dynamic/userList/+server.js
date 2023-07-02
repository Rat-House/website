import { json } from '@sveltejs/kit';

/**
 * @typedef {import("../../../dbtypes.js").User} User
 */

/** @type {import("./$types").RequestHandler} */
export async function GET({ locals, url }) {
  const items = url.searchParams.getAll('user');
  if (items.length === 0) {
    return json({ users: {} });
  }
  const filter = [...new Set(items)].map((s) => `username="${s}"`).join('||');
  /** @type {Array.<User>} */
  const users = await locals.pb.collection('userList').getFullList({ filter: filter });
  return json(
    users.reduce(/** @param {Object.<string,User>}o */(o, i) => {
      o[i.username] = i;
      return o;
    }, {})
  );
}
