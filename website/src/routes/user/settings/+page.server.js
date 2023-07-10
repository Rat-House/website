/**
 * @typedef {import("../../../dbtypes.d").User} User
 * @typedef {import("../../../dbtypes.d").Bio} Bio
 * @typedef {import("../../../dbtypes.d").OathImage} OathImage
 */

import { error, fail } from '@sveltejs/kit';
import { getFileUrlFromRecord } from '$lib/tools.js';

/** @type {import("./$types").PageServerLoad} */
export async function load({ locals }) {
  if (!locals.pb.authStore.model)
    throw error(401, "You can't edit your profile without logging in");

  const user = locals.pb
    .collection('userList')
    .getFirstListItem(`id="${locals.pb.authStore.model.id}"`, {
      expand: 'bio'
    })
    .then((u) => {
      {
        let user = /** @type {User} */ (u);

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          bio: user.bio ? /** @type {Bio} */ (user.expand.bio).bio : '',
          avatar: user.avatar
        };
      }
    });

  const connectedAuthMethods = locals.pb
    .collection('users')
    .listExternalAuths(locals.pb.authStore.model.id)
    .then((pList) => pList.map((p) => p.provider));

  const images = locals.pb
    .collection('oathUserImage')
    .getFullList()
    .then((records) => {
      /** @type {Object.<String,String>} */
      const items = {};

      for (let imageRecord of /** @type {Array.<OathImage>} */ (records)) {
        items[imageRecord.provider] = getFileUrlFromRecord(imageRecord, imageRecord.avatar);
      }

      return items;
    });

  const oauthMethods = locals.pb
    .collection('users')
    .listAuthMethods()
    .then((methods) => {
      /** @type {Array.<String>} */
      let providers = [];
      methods.authProviders.forEach((p) => {
        providers.push(p.name);
      });
      return providers.sort((a, b) => a.localeCompare(b));
    });

  return {
    user: user,

    oauthMethods: oauthMethods,
    connectedOauthMethods: connectedAuthMethods,
    oauthImage: images
  };
}

/** @type {import("./$types").Actions} */
export const actions = {
  unlink: async ({ locals, request }) => {
    if (!locals.pb.authStore.model) return fail(401); //, 'not signed in');
    const data = await request.formData();
    if (!data.has('provider')) return fail(400, { provider: null, missing: true });

    const provider = /** @type {FormDataEntryValue} */ (data.get('provider')).toString();
    if (
      await locals.pb
        .collection('users')
        .listExternalAuths(locals.pb.authStore.model.id)
        .then((pList) => {
          const providers = pList.map((p) => p.provider);
          return providers.length <= 1 && providers.includes(provider);
        })
    )
      return fail(422); //, 'You are not allowed to unlink all your providers');

    await locals.pb.collection('users').unlinkExternalAuth(locals.pb.authStore.model.id, provider);
  },

  setImage: async ({ locals, request }) => {
    if (!locals.pb.authStore.model) return fail(401); //, 'not signed in');
    const data = await request.formData();
    if (data.get('image') == null && data.get('imageLink') == null)
      return fail(400, { image: null, imageLink: null, missing: true });

    let submit = new FormData();
    if (data.has('imageLink')) {
      submit.append(
        'avatar',
        await fetch(/** @type {FormDataEntryValue} */ (data.get('imageLink')).toString()).then(
          (r) => r.blob()
        )
      );
    } else {
      submit.append('avatar', /** @type {FormDataEntryValue} */ (data.get('image')));
    }

    await locals.pb.collection('users').update(locals.pb.authStore.model.id, submit);
  }
};
