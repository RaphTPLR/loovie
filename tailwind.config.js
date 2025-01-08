/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F34848',
        black: '#090909',
        white: '#fff',
      },
    },
  },
  plugins: [],
}
