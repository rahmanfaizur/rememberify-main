/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#ffffff',
          300: '#f9fbfc',
          600: '#dddddd'
        },
        purple: {
          300: "#e0e7ff",
          500: "#3d32be",
          600: "#5046e4",
        }
      }
    },
  },
  plugins: [],
}

