export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          50:  '#fdf4ef',
          100: '#fae4d4',
          900: '#111110',
          800: '#171614',
          700: '#1a1917',
          600: '#222120',
          500: '#2a2927',
          400: '#343230',
        },
        brand: {
          300: '#f5a070',
          400: '#f07a3a',
          500: '#e8621e',
          600: '#c04e18',
          700: '#9a3d12',
        },
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 70% 55% at 25% -5%, rgba(232,98,30,0.2) 0%, transparent 65%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
