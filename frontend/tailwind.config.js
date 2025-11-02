import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      {
        black: {
          primary: "#000000",
          secondary: "#191919",
          accent: "#313131",
          neutral: "#4a4a4a",
          "base-100": "#000000",
          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#ff5724",
        },
      },
      "cupcake",
      "emerald",
      "retro",
      "cyberpunk",
      "synthwave",
      "valentine",
      "halloween",
    ],
  },
};
