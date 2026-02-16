/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },

      animation: {
        fadeIn: "fadeIn 0.5s ease-out",
        scrollLeft: "scroll-left 30s linear infinite",
        scrollRight: "scroll-right 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scroll-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        navBg: "url('/src/assets/navbg.png')",
      },
    },
  },
  plugins: [],
};
