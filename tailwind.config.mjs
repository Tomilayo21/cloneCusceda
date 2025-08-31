/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // or 'media'
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      gridTemplateColumns:{
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
    },
  },
  extend: {
    colors: {
      highcontrast: '#000',
      highcontrastText: '#FFD700', // gold or yellow for text
    },
  },
   extend: {
      animation: {
        'spin-slow': 'spin 6s linear infinite', // slower spin
      },
    },
  plugins: [],
};
