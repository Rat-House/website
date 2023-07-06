import { authFromCookie, pb } from '$lib/pocketbase.js';
import { error } from '@sveltejs/kit';
import { capitaliseOnlyFirst } from '$lib/tools.js';
import { HeaderBuilder } from '$lib/headers.js';

/**
 * @typedef {import("../../../dbtypes.d").Contact} Contact
 * @typedef {import("../../../dbtypes.d").ReadableContact} ReadableContact
 * @typedef {import("../../../dbtypes.d").ContactRead} ContactRead
 * @typedef {import("../../../dbtypes.d").User} User
 * @typedef {import("../../../dbtypes.d").Authority} Authority
 */

/** @type {import("./$types").PageLoad} */
export async function load({ parent }) {
  new HeaderBuilder()
    .setTitle('Contact messages')
    .setDescription('List of messages people sent to us')
    .save();

  authFromCookie((await parent()).pbCookie);
  if (!pb.authStore.model)
    throw error(401, {
      message: 'You are not logged in'
    });

  /** @type {User} */
  const user = await pb.collection('users').getOne(pb.authStore.model.id, {
    expand: 'authority'
  });

  const authLevel = /** @type {Authority} */ (user.expand.authority);

  if (authLevel.level < 2)
    throw error(403, {
      message: `You are a ${capitaliseOnlyFirst(
        authLevel.name
      )} so you don't have sufficient perms to view this page`
    });

  return {
    messages: /** @type {Promise<Array.<ReadableContact>>} */ new Promise((resolve) => {
      /** @type {Promise<Array.<Contact>>} */
      const read = pb.collection('contactsRead').getFullList({
        filter: `user="${user.id}"`
      });
      /** @type {Promise<Array.<ContactRead>>} */
      const messages = pb.collection('contact').getFullList({
        sort: '-created',
        fields: 'id,name,email,message,reason,created'
      });

      const asy = async () => {
        const messagesToRead = /** @type {Array.<ReadableContact>} */ (await messages);
        const messagesRead = await read;

        for (let contact of messagesToRead) {
          contact.read = messagesRead.findIndex((i) => i.message === contact.id) !== -1;
        }

        resolve(messagesToRead);
      };
      asy();
    })
  };
}
