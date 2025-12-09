/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        correct: '#6aaa64',
        present: '#c9b458',
        absent: '#787c7e',
        dark: '#121213',
      },
    },
  },
  plugins: [],
}
