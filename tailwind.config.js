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
          DEFAULT: '#D63864',
          light: '#FF6B8A',
          dark: '#B02952',
          50: '#FFF0F3',
          100: '#FFD6E0',
          200: '#FFB3C6',
          300: '#FF85A1',
          400: '#FF4D78',
          500: '#D63864',
          600: '#B02952',
          700: '#8B1C40',
          800: '#6B1232',
          900: '#4F0D25',
        },
        app: {
          bg: '#FFF0F3',
          card: '#FFFFFF',
          border: '#F2E4E8',
          text: '#1C1C1E',
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
        'card': '0 2px 20px rgba(214, 56, 100, 0.08)',
        'card-hover': '0 8px 40px rgba(214, 56, 100, 0.18)',
        'bottom-nav': '0 -4px 30px rgba(0, 0, 0, 0.08)',
        'fab': '0 4px 24px rgba(214, 56, 100, 0.45)',
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
