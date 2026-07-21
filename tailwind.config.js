/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0e17",
          900: "#10131f",
          850: "#12182a",
        },
        neon: {
          cyan: "#22d3ee",
          violet: "#8b5cf6",
          gold: "#f5c451",
          green: "#33d69f",
          rose: "#fb7185",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(4,8,20,0.65), 0 0 40px rgba(34,211,238,0.12)",
      },
    },
  },
  plugins: [],
};
