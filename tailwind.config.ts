import type { Config } from "tailwindcss";

const config: Config = {
  // Tailwind v4 uses automatic content detection
  // Configuration is now primarily done in CSS using @theme
  darkMode: "class",
  plugins: [require("tailwindcss-animate")],
};

export default config;
