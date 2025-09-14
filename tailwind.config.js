/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'ripple': 'ripple 0.6s ease-out',
        'bounce-gentle': 'bounce-gentle 3s ease-in-out infinite',
        'pulse-african': 'pulse-african 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dance-african': 'dance-african 2s ease-in-out infinite',
        'glow-african': 'glow-african 3s ease-in-out infinite'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        'pulse-african': {
          '0%, 100%': { 
            opacity: '1', 
            transform: 'scale(1)',
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)'
          },
          '50%': { 
            opacity: '0.9', 
            transform: 'scale(1.1)',
            boxShadow: '0 0 50px rgba(251, 191, 36, 0.9)'
          }
        },
        'dance-african': {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-5px) rotate(-2deg)' },
          '75%': { transform: 'translateX(5px) rotate(2deg)' }
        },
        'glow-african': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 107, 53, 0.6)' }
        }
      }
    },
  },
  plugins: [],
};
