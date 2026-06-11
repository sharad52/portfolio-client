import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Modern, technical-elegant display + clean body + mono
        'display': ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Desaturated slate blue-grey canvas (Artoo palette) — lighter & airier
        base: {
          DEFAULT: '#3a484e',
          900: '#2e3c41', // deepest slate (edges)
          800: '#36444a',
          700: '#415157',
          600: '#4b5b61',
        },
        // Glass surfaces / hairline borders are handled via utilities
        ink: '#3a484e',          // kept for legacy refs; the slate canvas
        cream: '#eef1f1',        // kept for legacy refs; near-white text
        line: 'rgba(255,255,255,0.08)',
        // Foreground text — soft, low-contrast (never pure white)
        fg: {
          DEFAULT: '#e8edee',
          muted: '#a7b2b4',
          faint: '#7e8c8f',
        },
        // Near-neutral steel accent ramp — low chroma to match the reference
        // (no teal/cyan; reads as a slightly brighter foreground, never a hue)
        accent: {
          DEFAULT: '#94a3a7',
          dark: '#6c777b',
          cyan: '#c3cdce',
          fuchsia: '#a7a7aa',
          indigo: '#8a969a',
        },
      },
      backgroundImage: {
        'grid': 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'aurora': 'radial-gradient(at 27% 37%, #4a5e64 0px, transparent 50%), radial-gradient(at 78% 25%, #5e8087 0px, transparent 50%), radial-gradient(at 45% 75%, #3e4f54 0px, transparent 50%)',
        'sheen': 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)',
      },
      boxShadow: {
        'glow': '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -20px rgba(120,130,133,0.50)',
        'glow-cyan': '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -20px rgba(185,193,195,0.40)',
        'card': '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 40px -24px rgba(0,0,0,0.55)',
      },
      keyframes: {
        'aurora-shift': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(4%, -3%, 0) scale(1.08)' },
          '66%': { transform: 'translate3d(-3%, 4%, 0) scale(0.96)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'aurora-shift': 'aurora-shift 18s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient-pan': 'gradient-pan 6s ease infinite',
        'marquee': 'marquee 32s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.2,0.6,0.4,1) infinite',
      },
    },
  },
  plugins: [typography],
}
