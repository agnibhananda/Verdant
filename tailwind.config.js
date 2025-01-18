/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'eco-primary': '#2D5A27',
        'eco-secondary': '#8CB369',
        'eco-accent': '#F4E285',
        'eco-background': '#F7F7F2',
        'eco-text': '#2C3E50'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};