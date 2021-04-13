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
        primary: "#b027b0",
        secondary: "#009688",
        error: "#f44336",
        success: "#4caf50",
        alert: "#ff9800",
        blue: "#2196f3",
        dark: "#212121"
      },
      // fontFamily: {
      //   'title': ['Montserrat', 'sans-serif'],
      //   'body': ['Lato', 'sans-serif']
      // },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
