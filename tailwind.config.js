/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#0D1117',
          900: '#161B22',
          800: '#21262D',
          700: '#30363D',
        },
        slate: {
          400: '#8B949E',
          200: '#C9D1D9',
          100: '#F0F6FC',
        },
        neon: {
          cyan: '#00E5FF',
          magenta: '#FF00FF',
          blue: '#00BFFF',
          green: '#39FF14',
          orange: '#FF8C00',
        },
        // Legacy colors for reference, can be removed
        accent: {
          teal: '#4A9B8E',
          'teal-dark': '#3A7A6F',
        }
      },
      fontFamily: {
        sans: ['Rajdhani', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'header': ['32px', '1.2'],
      },
      boxShadow: {
        'glow-cyan': '0 0 3px rgba(0, 229, 255, 0.8), 0 0 6px rgba(0, 229, 255, 0.5)',
        'glow-magenta': '0 0 3px rgba(255, 0, 255, 0.8), 0 0 6px rgba(255, 0, 255, 0.5)',
        'glow-blue': '0 0 3px rgba(0, 191, 255, 0.8), 0 0 6px rgba(0, 191, 255, 0.5)',
        'glow-green': '0 0 3px rgba(57, 255, 20, 0.8), 0 0 6px rgba(57, 255, 20, 0.5)',
        'glow-orange': '0 0 3px rgba(255, 140, 0, 0.8), 0 0 6px rgba(255, 140, 0, 0.5)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
