/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#09090b',
          surface: '#121215',
          elevated: '#18181b',
          card: '#141418',
        },
        border: {
          DEFAULT: '#27272a',
          subtle: '#1f1f23',
          strong: '#3f3f46',
        },
        cyber: {
          red: '#ef4444',
          'red-muted': '#991b1b',
          amber: '#f59e0b',
          cyan: '#06b6d4',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
