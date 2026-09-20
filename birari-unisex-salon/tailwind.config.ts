import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0b0b0c",
          soft: "#16161a"
        },
        gold: {
          50: "#fbf6e8",
          100: "#f4e6bd",
          200: "#eed491",
          300: "#e6c364",
          400: "#dbae3f",
          500: "#c9a227",
          600: "#a9841c",
          700: "#846617",
          800: "#5f4a11",
          900: "#3b2d0a"
        },
        cream: "#faf7f0"
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        premium: "0 10px 40px -12px rgba(0,0,0,0.25)",
        gold: "0 8px 28px -10px rgba(201,162,39,0.45)"
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #eed491 0%, #c9a227 45%, #8a6a15 100%)"
      }
    }
  },
  plugins: []
};

export default config;
