import { error, fail } from '@sveltejs/kit';

/** @type {import("./$types").Actions} */
export const actions = {
  read: async ({ request, locals }) => {
    if (!locals.pb.authStore.model) return fail(401, { error: 'not signed in' });
    await locals.pb.collection('contactsRead').create({
      user: locals.pb.authStore.model.id,
      message: await getID(request)
    });
  },
  unread: async ({ request, locals }) => {
    const messageId = await getID(request);
    const record = await locals.pb
      .collection('contactsRead')
      .getFirstListItem(`message="${messageId}"`);
    await locals.pb.collection('contactsRead').delete(record.id);
  }
};

/**
 * @param {Request} request
 * @return {Promise<string>}
 */
async function getID(request) {
  const data = await request.formData();
  const id = data.get('id');
  if (id === null)
    throw error(422, {
      message: 'Missing id'
    });
  return id.toString();
}
