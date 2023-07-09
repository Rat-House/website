import { authFromCookie, pb } from '$lib/pocketbase.js';
import { error } from '@sveltejs/kit';
import { HeaderBuilder } from '$lib/headers.js';

/**
 * @typedef {import("../../../dbtypes").User} User
 * @typedef {import("../../../dbtypes").Authority} Authority
 */

/** @type {import("./$types").PageLoad} */
export async function load({ parent, params }) {
  const data = await parent();
  authFromCookie(data.pbCookie);

  /** @type {function(string):void} */
  let userAuthResolve;
  /** @type {Promise<String>} */
  const userAuth = new Promise((resolve) => {
    userAuthResolve = resolve;
  });
  /** @type {Promise<User>} */
  const user = new Promise((resolve, reject) => {
    pb.collection('userList')
      .getFirstListItem(`id="${params.slug}" || username="${params.slug}"`, {
        expand: 'authority,bio'
      })
      .then((user) => {
        resolve(/** @type {User} */ (user));
        const auth = /** @type {Authority} */ (user.expand.authority);
        userAuthResolve(auth.name);

        new HeaderBuilder()
          .setTitle(`${user.name}'s profile page`)
          .setDescription(`${user.name} is a ${auth.name}`)
          .save();
      })
      .catch(() => {
        userAuthResolve('User');
        reject(error(404, 'not a user'));
      });
  });

  return {
    user: user,
    authorityName: userAuth
  };
}
