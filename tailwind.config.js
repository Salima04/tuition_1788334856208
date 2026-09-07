/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        teal: {
          primary: '#0D7377',
          dark: '#0A5A5D',
          light: '#E8F4F4',
          mid: '#1A9197',
        },
        charcoal: {
          DEFAULT: '#2C3E50',
          light: '#4A5568',
          muted: '#718096',
        },
        amber: {
          DEFAULT: '#F2A922',
          dark: '#D4911A',
          light: '#FEF3DC',
        },
        bg: {
          white: '#F7F9FC',
          pure: '#FFFFFF',
        },
        border: {
          light: '#E2E8F0',
          mid: '#CBD5E0',
        },
      },
      animation: {
        'slide-up': 'slideInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.6s ease both',
        'pulse-amber': 'pulseAmber 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};