/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F07122",
        secondary: "#0FE8DC",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        lexend: ['"Lexend"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
