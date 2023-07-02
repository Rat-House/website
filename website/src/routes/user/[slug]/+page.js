import { authFromCookie, pb } from '$lib/pocketbase.js';

/**
 * @typedef {import("../../../dbtypes").User} User
 * @typedef {import("../../../dbtypes").Authority} Authority
 */

/** @type {import('./$types').PageLoad} */
export async function load({ parent, params, event }) {
  console.log(event);
  const data = await parent();
  authFromCookie(data.pbCookie);

  let userAuthResolve;
  /** @type {Promise<String>} */
  const userAuth = new Promise((resolve)=>{
    userAuthResolve = resolve
  })
  /** @type {Promise<User>} */
  const user = new Promise((resolve)=> {
    pb.collection('userList').getFirstListItem(`id="${params.slug}" || username="${params.slug}"`, {
      expand: 'authority',
    }).then(/** @param {User} user */(user)=>{
      resolve(user);
      userAuthResolve(/** @type {Authority} */(user.expand.authority).name)
    }).catch(()=>{
      resolve({});
      userAuthResolve("User");
    });
  });

  return {
    user: user,
    authorityName: userAuth,
  };
}
