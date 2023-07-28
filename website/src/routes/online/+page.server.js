import { createHash } from 'crypto';

const maxUsers = 20;
const maxInactivity = 20 * 1000; // 20 seconds

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, locals }) {
  const users = await locals.pb.collection("online").getFullList(undefined,{
    fields:"updated,id,uid,data"
  })

  /** @type {Array.<{position:{x:number,y:number}, id:string}>} */
  let activeUsers = [];
  const now = new Date();
  for (let user of users) {
    if ((now - new Date(user.updated)) > maxInactivity) {
      locals.pb.collection("online").delete(user.id);
      continue
    }
    activeUsers.push({
      id:user.uid,
      position: user.data
    })
  }
  if (activeUsers.length >= maxUsers) return {};

  let id=/** @type{string|undefined} */ await cookies.get("onlineId");

  if (id === undefined || locals.pb.authStore.model) {
    id = locals.pb.authStore.model? getId(locals.pb.authStore.model.id) : getId();
    cookies.set("onlineId", id);
  }

  return {
    id: id,
    users: activeUsers
  }
}

/**
 * @param {string|undefined} seed
 * @return {string}
 */
function getId(seed) {
  if (seed === undefined) seed = crypto.randomUUID();
  return createHash('sha1').update(seed).digest('hex');
}
