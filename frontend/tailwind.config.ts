import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        maroon: {
          DEFAULT: '#7C1D1D',
          dark: '#5C1515',
          light: '#9B2D2D',
        },
        gold: {
          DEFAULT: '#C8951A',
          light: '#D4A84B',
        },
        cream: {
          DEFAULT: '#FDF6EC',
          dark: '#F5E6D0',
        },
      },
    },
  },
  plugins: [],
}

export default config