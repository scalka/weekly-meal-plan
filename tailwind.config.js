module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'rp-pink-50': '#a64d62',
        'rp-pink-20': '#af5f72',
        'rp-yellow-20': '#fff7da',
        'rp-yellow-50': '#ffe483', // yellow
        'rp-text': '#15180b',
        'rp-background': '#fefff9',
        'rp-green-50': '#418264',
        'rp-green-30': '#f0f7cd',
        'rp-green-40': '#d8deb9',
        'rp-green-80': '#2e5d47',
      },
      gridTemplateColumns: {
        7: 'repeat(7, 1fr)',
      },
    },
    fontFamily: {
      sans: ['Neue Haas Grotesk Display Pro', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
  plugins: [],
};
