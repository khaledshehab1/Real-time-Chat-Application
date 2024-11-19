/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spinAndMove: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(360deg) translateX(5px)" },
          "50%": { transform: "rotate(360deg) translateX(10px)" },
          "75%": { transform: "rotate(360deg) translateX(5px)" },
        },
        pushSettings: {
          "0%, 50%, 100%": { transform: "translateX(0)" },
          "75%": { transform: "translateX(20px)" },
        },
      },
      animation: {
        spinAndMove: "spinAndMove 1s ease-in-out",
        pushSettings: "pushSettings 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
