/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cabin: ['Cabin', 'sans-serif'],
      },
      colors: {
        'custom-dark': {
          500: '#272727',
          600: '#202020',
          700: '#2d2d2d',
        },
        'custom-light': {
          500: '#f9f9f9',
          600: '#f3f3f3',
          700: '#eaeaea',
        },
        'admin-dark': {
          500: '#202124',
          600: '#2e2f31',
          700: '#3c3d40',
        },
        'admin-light': {
          500: '#ffffff',
          600: '#f3f6fb',
          700: '#eaeaea',
        },
      },
    },
  },
  plugins: [],
};
