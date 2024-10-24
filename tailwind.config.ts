import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      hsp: "1066px",
      xl: "1440px",
    },
    extend: {
      colors: {
        secondary: "#B71C1C",
        primary: "#EDEDED",
        main: "#fdf6e6",
        blacc: "#221911",
        warmwhite: "#FAF8F0",
        overlay: "rgba(0, 0, 0, 0.4)",
      },
      fontFamily: {
        lato: ['"Lato"', "sans-serif"],
        poppins: ['"Poppins"', "sans-serif"],
      },
      boxShadow: {
        customhover: "0px 6px 8px 4px rgba(0, 0, 0, 0.05)",
        custom: "0px 4px 4px 0px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
