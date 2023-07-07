import { fail } from '@sveltejs/kit';
import { MESSAGES_WEBHOOK_URL } from '$env/static/private';

/** @type {import("./$types").Actions} */
export const actions = {
  post: async ({ request, locals }) => {
    const user = locals.pb.authStore.model ? locals.pb.authStore.model.id : '';
    let formData = await request.formData();

    try {
      const record = await sendContactMessage(
        locals.pb,
        user,
        (formData.get('name') ?? '').toString().trim(),
        (formData.get('email') ?? '').toString().trim(),
        (formData.get('message') ?? '').toString().trim(),
        (formData.get('reason') ?? '').toString().trim()
      );

      fetch(MESSAGES_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(generateEmbed(record)),
        headers: { 'content-type': 'application/json' }
      });

      return {
        contactId: record.id
      };
    } catch (e) {
      return fail(422, {
        name: formData.get('name'),
        email: formData.get('email'),
        reason: formData.get('reason'),
        message: formData.get('message'),
        error: /** @type {Error} */ (e).message ?? e
      });
    }
  }
};

/**
 * @typedef {import("../../dbtypes.d").Contact} Contact
 * @param {import("../../dbtypes.d").PocketBase} pb
 * @param {string} user
 * @param {string} name
 * @param {string} email
 * @param {string} message
 * @param {string} reason
 * @return {Promise<Contact>}
 */
async function sendContactMessage(pb, user, name, email, message, reason) {
  if (name === '') throw new Error('Name must be provided for contact');
  if (email === '') throw new Error('An email must be provided for contact');
  if (message === '') throw new Error('A message must be provided for contact');

  return /** @type {Contact} */ (
    await pb.collection('contact').create({
      name: name,
      user: user,
      reason: reason,
      email: email,
      message: message
    })
  );
}

/**
 * @param {Contact} contactMessage
 * @return {Object.<string,*>}
 */
function generateEmbed(contactMessage) {
  return {
    content: null,
    embeds: [
      {
        title: contactMessage.name,
        color: 0x1e8cc2,
        fields: [
          {
            name: 'Reason',
            value: contactMessage.reason
          },
          {
            name: 'Message',
            value: '```\n' + contactMessage.message.replace('`', '\\`') + '\n```'
          }
        ],
        author: {
          name: contactMessage.email
        },
        footer: {
          text: contactMessage.id
        },
        timestamp: new Date(contactMessage.created).toISOString()
      }
    ],
    username: 'Contact message',
    avatar_url: 'https://rathouse.ca/favicon.png',
    attachments: [],
    flags: 4096
  };
}
