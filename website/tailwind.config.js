import daisyUI from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: [daisyUI],
  darkMode: ['class', '[data-theme="dark"]']
  // ...
};
