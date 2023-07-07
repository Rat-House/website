import typography from '@tailwindcss/typography';
import daisyUI from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: [typography, daisyUI],
  darkMode: ['class', '[data-theme="dark"]']
  // ...
};
