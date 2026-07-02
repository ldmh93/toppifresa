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
        primary: {
          DEFAULT: '#b5191a',
          light: '#e2787d',
          dark: '#9c0b0a',
          50: '#f9e4e5',
          100: '#fec5cb',
          200: '#f3a2ac',
          300: '#e2787d',
          400: '#d44c52',
          500: '#b5191a',
          600: '#9c0b0a',
          700: '#7a0707',
          800: '#4b100d',
          900: '#150c09',
        },
        brand: {
          red: '#b5191a',
          crimson: '#9c0b0a',
          maroon: '#4b100d',
          black: '#150c09',
          salmon: '#e2787d',
          pink: '#ff7bac',
          rose: '#fec5cb',
          cream: '#f9e4e5',
          olive: '#626c3b',
          green: '#2b803b',
        },
        app: {
          bg: '#f9e4e5',
          card: '#FFFFFF',
          border: '#e8c5c7',
          text: '#150c09',
          muted: '#8E8E93',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 2px 20px rgba(181, 25, 26, 0.08)',
        'card-hover': '0 8px 40px rgba(181, 25, 26, 0.18)',
        'bottom-nav': '0 -4px 30px rgba(0, 0, 0, 0.08)',
        'fab': '0 4px 24px rgba(181, 25, 26, 0.45)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse_soft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        pulse_soft: 'pulse_soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
