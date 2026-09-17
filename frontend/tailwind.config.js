/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#102A43',
          900: '#0B192C',
          950: '#070F1E',
        },
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        vit: {
          navy: '#0B2545',
          blue: '#134074',
          royal: '#0F3A78',
          accent: '#1D4ED8',
          subtle: '#EEF4F8',
        },
        verified: {
          light: '#ECFDF5',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        advisory: {
          light: '#FFFBEB',
          DEFAULT: '#D97706',
          dark: '#B45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'fintech': '0 1px 3px 0 rgba(11, 25, 44, 0.05), 0 1px 2px 0 rgba(11, 25, 44, 0.03)',
        'fintech-md': '0 4px 14px -2px rgba(11, 25, 44, 0.07), 0 2px 6px -1px rgba(11, 25, 44, 0.04)',
        'fintech-hover': '0 10px 25px -3px rgba(11, 25, 44, 0.09), 0 4px 10px -2px rgba(11, 25, 44, 0.04)',
      },
    },
  },
  plugins: [],
}
