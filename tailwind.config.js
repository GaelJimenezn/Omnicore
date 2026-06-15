/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        omni: {
          dark: '#05050A', // Ultra deep space black
          panel: '#10121A', // Slightly lighter black for panels
          hover: '#1E2333',
          accent: '#00F0FF', // Cyan Neon
          accentHover: '#00C2CC',
          secondary: '#7000FF', // Cyberpunk Purple
          text: '#F8FAFC',
          textMuted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulseSlow 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0,240,255,0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0,240,255,0.8), 0 0 10px rgba(112,0,255,0.5)' },
        }
      }
    },
  },
  plugins: [],
}
