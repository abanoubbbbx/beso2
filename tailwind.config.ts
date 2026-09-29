import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", lg: "2.5rem" }, screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        ink: {
          0: "#ffffff", 50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7",
          300: "#a1a1aa", 400: "#52525b", 500: "#3f3f46", 600: "#27272a",
          700: "#18181b", 800: "#0d0d0f", 900: "#050506", 950: "#000000",
        },
        accent: { DEFAULT: "#c9a86a", soft: "#e5d3a8" },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui"],
      },
      letterSpacing: { tightest: "-0.04em", luxe: "0.28em" },
      transitionTimingFunction: { luxe: "cubic-bezier(0.22, 1, 0.36, 1)" },
      boxShadow: {
        luxe: "0 30px 80px -20px rgba(0,0,0,0.55)",
        rim: "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "ken-burns": { "0%": { transform: "scale(1.05)" }, "100%": { transform: "scale(1.15)" } },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "ken-burns": "ken-burns 14s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
export default config;
