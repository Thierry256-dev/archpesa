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
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        blue: {
          DEFAULT: "#2563eb",
        },
        indigo: {
          DEFAULT: "#4f46e5",
        },
        emerald: {
          DEFAULT: "#10b981",
        },
        yellow: {
          DEFAULT: "#f59e0b",
        },
        orange: {
          DEFAULT: "#ea580c",
        },
        red: {
          DEFAULT: "#ef4444",
        },
        rose: {
          DEFAULT: "#e11d48",
        },
        purple: {
          DEFAULT: "#a855f7",
        },
        white: "#fff",
        black: "#000",
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")], // Add this line
};
