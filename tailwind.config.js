/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind requires the preset and the paths to every file using className.
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand palette — teal-cyan, matching the Tech Nova app theme.
        brand: {
          DEFAULT: '#309CDC',
          50: '#E6F8FB',
          100: '#CCF1F8',
          500: '#309CDC',
          600: '#309CDC',
          700: '#1F7BA0',
        },
        accent: {
          DEFAULT: '#38BDF8',
          500: '#38BDF8',
          600: '#0EA5E9',
        },
        ink: {
          DEFAULT: '#1A1A2E',
          muted: '#6B7280',
          faint: '#9CA3AF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F6F8',
          border: '#E5E7EB',
        },
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
        info: '#309CDC',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
