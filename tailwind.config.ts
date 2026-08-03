import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#fbf9f4',
        'surface-dim': '#dbdad5',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3ee',
        'surface-container': '#f0eee9',
        'surface-container-high': '#eae8e3',
        'surface-container-highest': '#e4e2dd',
        'on-surface': '#1b1c19',
        'on-surface-variant': '#44483a',
        outline: '#757969',
        'outline-variant': '#c5c8b6',

        primary: {
          DEFAULT: '#4a6410',
          container: '#627e29',
          fixed: '#cdee8c',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          container: '#faffe7',
        },

        secondary: {
          DEFAULT: '#77574d',
          container: '#fed3c7',
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          container: '#795950',
        },

        tertiary: {
          DEFAULT: '#924700',
          container: '#b75b00',
        },
        'on-tertiary': {
          DEFAULT: '#ffffff',
          container: '#fffbff',
        },

        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#93000a',
        },
      },

      fontFamily: {
        display: ['Be Vietnam Pro', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Hanken Grotesk', 'sans-serif'],
      },

      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },

      boxShadow: {
        'organic-sm': '0 1px 2px 0 rgba(93, 64, 55, 0.05)',
        organic: '0 2px 8px 0 rgba(93, 64, 55, 0.08)',
        'organic-md': '0 4px 12px 0 rgba(93, 64, 55, 0.10)',
        'organic-lg': '0 8px 24px 0 rgba(93, 64, 55, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
