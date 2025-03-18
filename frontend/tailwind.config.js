/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm-custom': '712px', // Custom breakpoint for 712px
        'md-custom': '905px', // Custom breakpoint for 712px
      },
      colors: {
        'my-custom': {
          400: "#39007d",
          100: "#f7aecc",
          300: "#7b62f9",
          800: "#08042c"
        },
        'new-pallete': {
          'text': '#040316',
          'background': '#fbfbfe',
          'primary': '#27afce',
          'secondary': '#dbfcff',
          'accent': '#3defff'           
        },
        gray: {
          50: "rgba(255, 255, 255, 0.5)",
          100: '#ffffff',
          300: '#f9fbfc',
          600: '#dddddd'
        },
        purple: {
          300: "#e0e7ff",
          500: "#3d32be",
          600: "#5046e4",
        },
        green: {
          500: "#1db954"
        },
        red: {
          500: "#FF0000"
        }
      }
    },
  },
  plugins: [],
}

