/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#030712',
          card: '#081120',
          cardHover: '#0d1b32',
          border: 'rgba(0, 210, 255, 0.25)',
          cyan: '#00d2ff',
          neonBlue: '#3a86ff',
          amber: '#ffb703',
          glowAmber: '#ff9100',
          darkBlue: '#050b14',
          slateBlue: '#0b1528',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 210, 255, 0.5)',
        'glow-cyan-lg': '0 0 50px -10px rgba(0, 210, 255, 0.6)',
        'glow-amber': '0 0 25px -5px rgba(255, 183, 3, 0.5)',
        'glow-amber-lg': '0 0 50px -10px rgba(255, 183, 3, 0.6)',
        'glow-blue': '0 0 25px -5px rgba(58, 134, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(0, 210, 255, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(0, 210, 255, 0.8))' },
        },
      },
    },
  },
  plugins: [],
}
