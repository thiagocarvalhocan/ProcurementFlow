/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
        screens: {
          '2lg': '1180px',
          '3lg': '1200px',
          '3xl': '1650px',
          '4xl': '1750px',
          '5xl': '1800px',
        },
      },
  },
  plugins: [],
}

