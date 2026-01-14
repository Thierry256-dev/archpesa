/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arch: {
          blue: "#07193f",
          green: "#10b981",
          teal: "#2FA4A9",
          slate: "#6B7280",
          offwhite: "#F8FAFC",
          charcoal: "#111827",
        },

        brand: {
          primary: "#07193f",
          secondary: "#10b981",
          surface: "#F8FAFC",
          text: "#111827",
        },
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")], // Add this line
};
