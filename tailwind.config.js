/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./packages/shared/src/**/*.{js,ts,jsx,tsx}",
    "./packages/web/index.html",
    "./packages/web/src/**/*.{js,ts,jsx,tsx}",
    "./packages/desktop/src/renderer/index.html",
    "./packages/desktop/src/renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};