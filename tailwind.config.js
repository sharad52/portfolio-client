/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Crimson Pro', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'ink': '#0f0f0f',
        'cream': '#faf8f4',
        'accent': '#c9a96e',
        'accent-dark': '#8b6f47',
      },
    },
  },
  plugins: [],
}
