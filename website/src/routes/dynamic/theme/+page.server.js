import { defaultTheme } from '$lib/stores/theme.js';
import { redirect } from '@sveltejs/kit';

/** @type {import("./$types").Actions} */
export const actions = {
  toggle: async ({ cookies, request }) => {
    const theme = cookies.get('theme') || defaultTheme;
    const data = await request.formData();

    cookies.set('theme', theme === 'light' ? 'dark' : 'light', {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
      httpOnly: false
    });
    throw redirect(303, /**@type {string}*/ (data.get('origin')) || '/dynamic/theme');
  }
};

/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies }) {
  return {
    theme: cookies.get('theme') || defaultTheme
  };
}
