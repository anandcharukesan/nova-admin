/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./nova_admin/templates/**/*.html",
    "./nova_admin/templatetags/**/*.py",
    "./nova_admin/static/**/*.js",
    "./src/**/*.{ts,tsx,html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        primary: "var(--color-primary, #2563EB)",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        bgLight: "#F8FAFC",
        bgDark: "#0F172A",
      },
      boxShadow: {
        premium: "0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 8px -1px rgba(15, 23, 42, 0.02)",
        hover: "0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 16px -6px rgba(15, 23, 42, 0.04)",
      },
      borderRadius: {
        custom: "16px",
      },
    },
  },
  plugins: [],
};
