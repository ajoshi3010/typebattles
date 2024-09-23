import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto-mono': ['Roboto Mono', 'monospace'],
      }, width: {
        '0.6': '0.2rem',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: "1" },
          '50%': { opacity: "0" },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'tb-w': '#D1D0C5',
        'tb-y': '#E2B714',
        'tb-grey': '#5D5F62',
        'tb-black':'#2c2e31'
      },
    },
  },
  plugins: [],
};
export default config;
