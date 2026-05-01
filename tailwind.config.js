/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#080A0F",
        primary: "#2F65B8",
        accent: "#F5BC36",
        soft: "#F7F7F7",
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px rgba(63, 105, 175, 0.26)",
        amber: "0 0 44px rgba(245, 188, 54, 0.22)",
      },
    },
  },
  plugins: [],
};
