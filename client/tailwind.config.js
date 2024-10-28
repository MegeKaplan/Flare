/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fffbeb",
          100: "#fef4c7",
          200: "#fee989",
          300: "#fed84b",
          400: "#fdc422",
          500: "#f7a308",
          600: "#db7b04",
          700: "#b55708",
          800: "#93430d",
          900: "#79370e",
          950: "#461b02",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          150: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
    },
  },
  plugins: [],
};

