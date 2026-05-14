/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D2249',
          light:   '#1A3566',
          muted:   '#6B7FA3',
        },
        brand: {
          DEFAULT: '#E8622A',
          hover:   '#C94F1E',
          light:   '#FDF0EB',
        },
      },
    },
  },
  plugins: [],
};
