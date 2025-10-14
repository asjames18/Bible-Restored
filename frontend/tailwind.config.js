/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        'theme-bg': 'var(--theme-bg)',
        'theme-text': 'var(--theme-text)',
        'theme-accent': 'var(--theme-accent)',
        'theme-accent-light': 'var(--theme-accent-light)',
        'theme-accent-dark': 'var(--theme-accent-dark)',
        'theme-surface': 'var(--theme-surface)',
        'theme-surface-hover': 'var(--theme-surface-hover)',
        'theme-border': 'var(--theme-border)',
        'hebrew-text': 'var(--hebrew-text)',
        'hebrew-glow': 'var(--hebrew-glow)',
        // Specific color values
        'gold': '#F5C542',
        'teal': '#0FF0B3',
      },
      fontFamily: {
        'sans': ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        'hebrew': ['Noto Serif Hebrew', 'serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'underline-sweep': 'underline-sweep 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            'box-shadow': '0 0 5px var(--hebrew-glow)',
          },
          '50%': { 
            'box-shadow': '0 0 20px var(--hebrew-glow), 0 0 30px var(--hebrew-glow)',
          },
        },
        'underline-sweep': {
          '0%': {
            transform: 'scaleX(0)',
            'transform-origin': 'left',
          },
          '100%': {
            transform: 'scaleX(1)',
            'transform-origin': 'left',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'shimmer': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--theme-text)',
            '--tw-prose-headings': 'var(--theme-text)',
            '--tw-prose-links': 'var(--theme-accent)',
            '--tw-prose-bold': 'var(--theme-text)',
            '--tw-prose-counters': 'var(--theme-accent)',
            '--tw-prose-bullets': 'var(--theme-accent)',
            '--tw-prose-hr': 'var(--theme-border)',
            '--tw-prose-quotes': 'var(--theme-text)',
            '--tw-prose-quote-borders': 'var(--theme-border)',
            '--tw-prose-captions': 'var(--theme-text)',
            '--tw-prose-code': 'var(--theme-text)',
            '--tw-prose-pre-code': 'var(--theme-text)',
            '--tw-prose-pre-bg': 'var(--theme-surface)',
            '--tw-prose-th-borders': 'var(--theme-border)',
            '--tw-prose-td-borders': 'var(--theme-border)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}


