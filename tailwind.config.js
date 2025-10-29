/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F07122",
        secondary: "#0FE8DC",
        customTeal: "#509F7F",
        goldenYellow: "#F8C56A",
        customPink: "#E488B7",
        purple: "#DCAFF2",
        customBlue: "#65B5F0",

        // warna tambahan dari gradient
        blueStart: "#6877E0",
        blueEnd: "#9EAAFF",
      },
      backgroundImage: {
        // custom gradient linear
        'custom-gradient': 'linear-gradient(90deg, #6877E0 0%, #9EAAFF 100%)',
      },
      fontFamily: {
        sans: ["var(--font-lexend)", "Lexend", "sans-serif"],
        lexend: ["var(--font-lexend)", "Lexend", "sans-serif"],
      },
    },
  },
  plugins: [],
};
