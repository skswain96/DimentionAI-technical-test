import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        button: "0px 3px 0px 0px #3F2ABD",
        dropdown:
          "#00000012 0px 3px 8px, #00000012 0px 2px 5px, #00000012 0px 1px 1px",
        alert:
          "#00000012 0px 3px 8px, #00000012 0px 2px 5px, #00000012 0px 1px 1px",
      },
    },
  },
  plugins: [],
};
export default config;
