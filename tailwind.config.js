/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customGray: '#F2F2F2',
        submiButton:'#3AB449'
      },
    },
  },
  plugins: [],
}