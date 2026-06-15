/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Usar clase 'dark' para forzar si es necesario, o media por defecto
  theme: {
    extend: {
      colors: {
        omni: {
          dark: '#0B0F19', // Muy oscuro para el fondo
          panel: '#1A202C', // Paneles y drawers
          hover: '#2D3748', // Hover states
          accent: '#00D1FF', // Azul cyan neón estilo Aniki/Playnite
          accentHover: '#00A3CC',
          text: '#E2E8F0',
          textMuted: '#A0AEC0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
