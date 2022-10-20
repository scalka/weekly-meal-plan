module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: '#4A6FB5',
        pink: '#E594DB',
        orange: '#ff7849',
        green: '#3A8569',
        yellow: '#DBB257',
        'gray-dark': '#273444',
        gray: '#D9D9D9',
        'gray-light': '#d3dce6',
        'rp-text': '#322F44',
        'rp-background': '#F3F0EA',
        'rp-offwhite': '#F5F5F5',
        'rp-light-blue': '#CCDBF4',
        'rp-green-light': '#E1EDE9',
        'rp-green-dark': '#20493A',
        'rp-yellow-light': '#E1EDE9',
      },
    },
    fontFamily: {
      sans: ['Neue Haas Grotesk Display Pro', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
  plugins: [],
};
