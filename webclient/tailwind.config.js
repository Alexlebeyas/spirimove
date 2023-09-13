/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      colors: {
        darkblue: {
          600: '#3C4952',
          800: '#2F3940',
        },
        red: '#E0303B',
        yellow: '#FFD233',
        blue: '#708EF4',
        lightblue: '#F5F7FF',
        lightgrey: '#EFF1F5',
        lightergrey: '#F6F7FA',
      },
    },
  },
  plugins: [],
};
