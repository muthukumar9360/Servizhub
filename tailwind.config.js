/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'multi-gradient': 'linear-gradient(to right, #000000, #ffffff, #000000, #ffffff, #000000)',
      },
      keyframes: {
        shimmer: {
          '0%': { 'background-position': '-200% center' },
          '100%': { 'background-position': '200% center' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 0.4 },
        },
        gradientMove: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      animation: {
        'text-shimmer': 'shimmer 3s linear infinite',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'spin-slow': 'spinSlow 20s linear infinite',
        'pulse-slow': 'pulseSlow 6s ease-in-out infinite',
        'bounce-delay-150': 'bounce 1s infinite 0.15s',
        'bounce-delay-300': 'bounce 1s infinite 0.3s',
        'gradient-x': 'gradientMove 3s ease infinite',
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
}
