/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,woff}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", "Calibri", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("tailwind-scrollbar-hide"),
  ],
};
