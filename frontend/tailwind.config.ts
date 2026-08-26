import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        industrial: {
          bone: "#F4F4F2",
          surface: "#FFFFFF",
          carbon: "#111111",
          orange: "#FF4500",
          steel: "#E2E8F0",
          dim: "#475569",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;
