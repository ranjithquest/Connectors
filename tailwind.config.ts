import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Segoe UI'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'Cascadia Code'", "'Consolas'", "monospace"],
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        accent: "var(--accent)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
        mid: "var(--border-mid)",
      },
    },
  },
  plugins: [],
};
export default config;
