const colors = require('tailwindcss/colors')
// console.log(`🚀 ~ file: tailwind.config.js ~ line 2 ~ colors`, colors)

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: colors,
    extend: {
      colors: {
        mike: {
          400: '#aa00ff',
          500: '#dd33dd'
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
