/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../shared/src/**/*.{js,ts,jsx,tsx}',
    '../web/index.html',
    '../web/src/**/*.{js,ts,jsx,tsx}',
    '../desktop/src/renderer/index.html',
    '../desktop/src/renderer/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')]
};
