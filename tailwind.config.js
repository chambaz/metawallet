module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      serif: ['Righteous'],
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
