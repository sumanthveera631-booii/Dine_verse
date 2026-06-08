/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#070707',
          dark: '#0e0e0e',
          brown: '#1A120B',
          amber: '#FFB347',
          orange: '#FF7A00',
          gold: '#FFD369',
          cream: '#FAF6F0',
          silver: '#E5E5E5',
        }
      },
      fontFamily: {
        heading: ['Changa One', 'cursive', 'sans-serif'],
        body: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-gold': '0 8px 32px 0 rgba(255, 211, 105, 0.08)',
        'glass-amber': '0 8px 32px 0 rgba(255, 179, 71, 0.12)',
        'neon-glow': '0 0 15px rgba(255, 122, 0, 0.6), 0 0 30px rgba(255, 179, 71, 0.3)',
        'gold-glow': '0 0 10px rgba(255, 211, 105, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
