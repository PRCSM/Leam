import type { Config } from "tailwindcss";

// Design tokens mirror the CSS custom properties in src/app/globals.css so
// utilities and hand-written component styles always agree.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#050505", raised: "#111111", card: "#1A1A1A" },
        paper: { DEFAULT: "#F7F7F5", muted: "#A4A4A4", faint: "#6B6B6B" },
        warm: "#E7D5A0",
        spark: "#F7E967",
        live: "#FF6D38",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      borderColor: { hair: "rgba(255,255,255,0.12)" },
      maxWidth: { shell: "1180px" },
      borderRadius: { phone: "22px" },
      transitionTimingFunction: { out: "cubic-bezier(.22,1,.36,1)" },
    },
  },
  plugins: [],
};

export default config;
