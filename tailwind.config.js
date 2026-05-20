/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FEF3EE',
          100: '#FAECE7',
          200: '#F5C4B3',
          300: '#EF9F7E',
          400: '#E57A54',
          500: '#D85A30',
          600: '#B94522',
          700: '#993C1D',
          800: '#7A3018',
          900: '#5C2312',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
