/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B3A6B",
        accent: "#E8A020",
        danger: "#C0392B",
        success: "#1A7A4A",
        light: "#F5F7FA",
        dark: "#0D1B2A",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
}
