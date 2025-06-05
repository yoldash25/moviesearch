/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1) translateY(-50%)' },
          '14%': { transform: 'scale(1.3) translateY(-50%)' },
          '28%': { transform: 'scale(1) translateY(-50%)' },
          '42%': { transform: 'scale(1.3) translateY(-50%)' },
          '70%': { transform: 'scale(1) translateY(-50%)' },
        },
      },
      animation: {
        heartbeat: 'heartbeat 1.5s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}