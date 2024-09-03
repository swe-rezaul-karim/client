/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tomato: '#FF6347',
        // primary: '#009688',
        // secondary: '#FF6F61'
        primary: '#22c55e',
        secondary: '#3b82f6',
        textColor: '#009688'
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

