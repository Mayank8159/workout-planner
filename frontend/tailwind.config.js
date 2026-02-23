/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Solo Leveling Dark Theme
        "dark-bg": "#0a0e27",
        "dark-card": "#1a1f3a",
        "dark-glass": "rgba(26, 31, 58, 0.4)",
        "neon-purple": "#a855f7",
        "neon-blue": "#0ea5e9",
        "neon-cyan": "#06b6d4",
        "neon-pink": "#ec4899",
        "glow-purple": "#c084fc",
        "glow-blue": "#38bdf8",
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.4)",
        "glow-blue": "0 0 20px rgba(14, 165, 233, 0.4)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.4)",
        "glow-pink": "0 0 20px rgba(236, 72, 153, 0.4)",
        "glow-lg": "0 0 40px rgba(168, 85, 247, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      opacity: {
        glass: "0.8",
      },
    },
  },
  plugins: [],
};
