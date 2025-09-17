/** @type {import('tailwindcss').Config} */
module.exports = {
  // This tells Tailwind to scan all of your HTML files for classes.
  content: [
    "./*.{html,js}",
    "./**/*.{html,js}"
  ],

  theme: {
    // We add our custom theme values to Tailwind's default set.
    extend: {
      colors: {
        'primary': '#2088ff',
        'primary-dark': '#2563EB', // <-- ADD THIS NEW COLOR
        'primary-hover': '#00b0e1',
        'text-dark': '#111827',
        'text-light': '#6B7280',
        'background-light': '#FFFFFF',
        'border-light': '#E5E7EB',
        'success': '#10B981',
        'error': '#EF4444',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'lg': '0.75rem',
      }
    },
  },
  plugins: [],
}