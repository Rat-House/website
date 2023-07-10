/**
 * @typedef {import("../../../dbtypes.d").User} User
 * @typedef {import("../../../dbtypes.d").Bio} Bio
 * @typedef {import("../../../dbtypes.d").OathImage} OathImage
 * @typedef {import("../../../dbtypes.d").Authority} Authority
 */

import { error, fail } from '@sveltejs/kit';
import { getAvatarUrl, getFileUrlFromRecord } from '$lib/tools.js';

/** @type {import("./$types").PageServerLoad} */
export async function load({ locals }) {
  if (!locals.pb.authStore.model)
    throw error(401, "You can't edit your profile without logging in");

  const user = locals.pb
    .collection('users')
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
          avatar: getAvatarUrl(user),
          avatarRaw: user.avatar
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
    if (!locals.pb.authStore.model) throw error(401, 'not signed in');
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
    if (!locals.pb.authStore.model) throw error(401, 'not signed in');
    const data = await request.formData();
    if (data.get('image') == null && data.get('imageLink') == null)
      return fail(400, { image: null, imageLink: null, missing: true });

    /** @type {FormData|{avatar:null}} */
    let submit = new FormData();
    if ((data.get('imageLink') ?? '') !== '') {
      submit.append(
        'avatar',
        await fetch(/** @type {FormDataEntryValue} */ (data.get('imageLink')).toString()).then(
          (r) => r.blob()
        )
      );
    } else if (data.has('image')) {
      submit.append('avatar', /** @type {FormDataEntryValue} */ (data.get('image')));
    } else {
      submit = { avatar: null };
    }

    if (!('avatar' in submit)) {
      const imageType = /** @type {Blob} */ (submit.get('avatar')).type;
      switch (imageType) {
        case 'image/webp':
        case 'image/gif':
        case 'image/svg+xml':
        case 'image/png':
        case 'image/jpeg':
          break;
        default:
          return fail(415, { unknownType: imageType });
      }
    }

    await locals.pb.collection('users').update(locals.pb.authStore.model.id, submit);
  },

  updateProfile: async ({ locals, request }) => {
    if (!locals.pb.authStore.model) throw error(401, 'not signed in');
    const data = await request.formData();
    const user = /** @type {User} */ (
      await locals.pb.collection('users').getOne(locals.pb.authStore.model.id)
    );
    if (!('bio' in user)) return fail(403, { bioId: undefined });

    /** @type {{name?:string,bio?:string}|undefined} */
    let updateUser = undefined;
    if (data.has('bio')) {
      const bioData = {
        bio: data.get('bio')?.toString()
      };

      if (user.bio !== '') {
        console.log(user.bio, bioData);
        await locals.pb.collection('bios').update(user.bio, bioData);
      } else {
        const record = await locals.pb.collection('bios').create(bioData);
        updateUser = { bio: record.id };
      }
    }

    if (data.has('name')) {
      if (updateUser === undefined) updateUser = {};
      updateUser.name = data.get('name')?.toString();
    }

    if (updateUser === undefined) return;

    await locals.pb.collection('users').update(user.id, updateUser);
  },

  promote: async ({ locals, request }) => {
    if (!locals.pb.authStore.model) throw error(401, 'not signed in');
    const data = await request.formData();
    const userId = data.get('user')?.toString();
    if (!userId) return fail(400, { user: userId });

    const authLevel = parseInt(data.get('auth')?.toString() ?? '');
    if (isNaN(authLevel)) return fail(400, { authLevel, bad: true });

    if (
      await locals.pb
        .collection('authorities')
        .getOne(/** @type {Authority} */ (locals.pb.authStore.model).authority, { fields: 'level' })
        .then((r) => /** @type {Authority} */ (r).level < authLevel)
    )
      return fail(400, { authLevel, insufficient: true });

    /** @type {string} */
    let authId;
    try {
      authId = await locals.pb
        .collection('authorities')
        .getFirstListItem(`level=${authLevel}`, { fields: 'id' })
        .then((r) => r.id);
    } catch (e) {
      return fail(400, { authLevel, error: /** @type {Error} */ (e).message });
    }

    try {
      await locals.pb.collection('users').update(userId, { authority: authId });
    } catch (e) {
      return fail(400, { user: userId, error: /** @type {Error} */ (e).message });
    }
  }
};
