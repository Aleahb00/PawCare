/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dfe9fe',
          200: '#c2d5fe',
          300: '#96b6fc',
          400: '#628ff8',
          500: '#3d68f0',
          600: '#2646e0',
          700: '#1D4ED8',
          800: '#1e3aad',
          900: '#1e3489',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a4f4fb',
          300: '#67e9f5',
          400: '#22C1DC',
          500: '#0fa3c2',
          600: '#0d81a0',
          700: '#116881',
        },
      },
      fontFamily: {
        sans: ['"Overpass"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
}
