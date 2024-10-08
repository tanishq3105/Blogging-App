/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customDark: '#1f2833',
        customDarkD: '#1b222c',
        customBlue: '#66fcf1',
        customGrey: '#c5c6c7',
        customDarkBlue: '#45a29e',
        customBlack: '#0b0c10'
      },
      keyframes: {
        loadingBar: {
          '0%': { left: '-100%', width: '100%' },
          '50%': { left: '0%', width: '100%' },
          '100%': { left: '100%', width: '10%' },
        },
      },
      animation: {
        'loading-bar': 'loadingBar 2s infinite',
      },
    },
  },
  plugins: [],
}
