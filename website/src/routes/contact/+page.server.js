import { fail } from '@sveltejs/kit';

/** @type {import("./$types").Actions} */
export const actions = {
  post: async ({ request, locals }) => {
    const user = locals.pb.authStore.isValid ? locals.pb.authStore.model.id : '';
    let formData = await request.formData();

    try {
      const record = await sendContactMessage(
        locals.pb,
        user,
        formData.get('name') ?? '',
        formData.get('email') ?? '',
        formData.get('message') ?? '',
        formData.get('reason') ?? ''
      );

      return {
        contactId: record.id
      };
    } catch (e) {
      return fail(422, {
        name: formData.get('name'),
        email: formData.get('email'),
        reason: formData.get('reason'),
        message: formData.get('message'),
        error: e.message
      });
    }
  }
};

async function sendContactMessage(pb, user, name, email, message, reason) {
  if (name === '') throw new Error('Name must be provided for contact');
  if (email === '') throw new Error('An email must be provided for contact');
  if (message === '') throw new Error('A message must be provided for contact');

  return await pb.collection('contact').create({
    name: name,
    user: user,
    reason: reason,
    email: email,
    message: message
  });
}
