import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fancyorange: "#ec6608",
        deeppurple: "#b90345",
        brightpetrole: "#009cbc",
        black: "#1d1d1b",
        grey: "#878787",
      },
    },
  },
  plugins: [],
} satisfies Config;
