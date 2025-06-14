/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#5F232D',
        'brand-primary-dark': '#4A1B23',
        'brand-accent-gold': '#B08D57',
        'brand-bg-cream': '#FDFBF5',
        'brand-bg-light': '#FAF7F2', // Alternative light background
        'brand-text-heading': '#3D1A20', // Darker shade of primary for headings
        'brand-text-body': '#4A4A4A', // Professional dark gray for body text
        'brand-success': '#4CAF50', // A clear, professional green
        'brand-success-dark': '#388E3C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example: Using Inter as a professional sans-serif
      },
    },
  },
  plugins: [],
};
