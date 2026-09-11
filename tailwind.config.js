/** @type {import('tailwindcss').Config} */
//
// Sistema de diseño Toppifresa — derivado del branding oficial.
//
// Los colores NO son inventados: salen de los SVG de "Branding toppifresa".
// El rojo #9C0B0A es el del logotipo y da 8.52:1 de contraste sobre blanco,
// así que sirve para texto pequeño sin problema (WCAG AA pide 4.5:1).
//
// ⚠️ rose, pink y gold son DECORATIVOS: su contraste sobre fondo claro está
// entre 1.9:1 y 2.9:1. Úsalos para fondos, bordes y acentos — nunca para
// texto sobre blanco.
//
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Rojo de marca. DEFAULT = el color exacto del logotipo.
        primary: {
          50: '#FDF2F2',
          100: '#FBE0DF',
          200: '#F6BEBE',
          300: '#EE9291',
          400: '#DE5B58',
          500: '#C3201C', // 6.09:1 — ok para texto
          600: '#B5191A',
          700: '#9C0B0A', // 8.52:1 — color del logo
          800: '#7D0708',
          900: '#6B0306', // 12.80:1
          DEFAULT: '#9C0B0A',
        },
        // Rosa palo del branding (decorativo).
        rose: {
          50: '#FDF6F6',
          100: '#F9E4E5',
          200: '#F6BEB6',
          300: '#F3A2AC',
          400: '#E2BCBC',
          500: '#E2787D',
          600: '#DE95A4',
          DEFAULT: '#E2787D',
        },
        // Rosa vivo del logotipo alterno (decorativo).
        pink: {
          100: '#FEC5CB',
          300: '#FF9DC2',
          500: '#FF7BAC',
          600: '#F03F60',
          DEFAULT: '#FF7BAC',
        },
        // Dorado de las semillas de la fresa (decorativo).
        gold: {
          100: '#FDE5A2',
          200: '#FCE199',
          400: '#FAC64F',
          500: '#F8B520',
          600: '#F8AF0F',
          DEFAULT: '#F8B520',
        },
        // Verde de las hojas.
        leaf: {
          300: '#5FB45E',
          500: '#2B803B',
          600: '#2A843F',
          700: '#256E35', // versión oscura, apta para texto
          DEFAULT: '#2A843F',
        },
        // Superficies de la app.
        app: {
          bg: '#FFF5F5',
          card: '#FFFFFF',
          border: '#F4E2E2',
          text: '#241012',
          muted: '#7C6668',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        // Inyectadas por next/font en app/layout.jsx (self-hosted, sin
        // llamadas a Google en runtime).
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card: '0 2px 16px rgba(156, 11, 10, 0.07)',
        'card-hover': '0 10px 40px rgba(156, 11, 10, 0.15)',
        'bottom-nav': '0 -4px 30px rgba(36, 16, 18, 0.08)',
        fab: '0 6px 24px rgba(156, 11, 10, 0.38)',
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
        float: {
          '0%, 100%': { transform: 'translateY(-4px)' },
          '50%': { transform: 'translateY(4px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        pulse_soft: 'pulse_soft 2s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
