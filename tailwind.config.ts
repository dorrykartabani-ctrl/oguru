import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Organic Tech palette
        surface: '#f6f4eb',
        background: '#f6f4eb',
        primary: {
          DEFAULT: '#4a6410',
          container: '#627e29',
        },
        secondary: {
          DEFAULT: '#77574d',
          container: '#fed3c7',
        },
        tertiary: {
          DEFAULT: '#924700',
          container: '#a38036',
        },
        'on-surface': '#1b1c19',
        'on-surface-variant': '#44483a',
        'on-primary': '#ffffff',
        'on-primary-container': '#ffffff',
        'on-secondary-container': '#3b2a25',
        'outline-variant': 'rgba(27, 28, 25, 0.12)',
        'surface-container': '#ebe8db',
        'surface-container-low': '#f1eee3',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e4e0d1',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        label: ['var(--font-label)', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        organic:
          '0 10px 30px -10px rgba(74, 100, 16, 0.08), 0 4px 12px -4px rgba(27, 28, 25, 0.04)',
        'organic-sm':
          '0 4px 16px -6px rgba(74, 100, 16, 0.06), 0 2px 6px -2px rgba(27, 28, 25, 0.03)',
        'organic-md':
          '0 16px 40px -12px rgba(74, 100, 16, 0.12), 0 8px 20px -8px rgba(27, 28, 25, 0.06)',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
