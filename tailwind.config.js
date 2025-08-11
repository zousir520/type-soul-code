/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'escapist': {
          'bg': '#0a0a0a',
          'card': '#1a1a1a',
          'border': '#2a2a2a',
          'text': '#e5e5e5',
          'text-secondary': '#a0a0a0',
          'accent': '#ff6b35',
          'accent-hover': '#ff8c5a',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
        'mono': ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
