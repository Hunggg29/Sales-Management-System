/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0C73B9',
        'primary-light': '#1E90FF',
      },
    },
  },
  plugins: [],
}
