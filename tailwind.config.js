/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  safelist: [
    "bg-emerald-500/15","text-emerald-400","border-emerald-500/30","bg-emerald-400",
    "bg-amber-500/15","text-amber-400","border-amber-500/30","bg-amber-400",
    "bg-red-500/15","text-red-400","border-red-500/30","bg-red-400",
    "bg-emerald-500/10","text-emerald-400","bg-red-500/10",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      colors: {
        jungle: {
          darkest: "#071510",
          dark:    "#0d2117",
          deep:    "#102b1e",
          mid:     "#1a4029",
          light:   "#2d6e45",
        },
        gold: {
          DEFAULT: "#c9a84c",
          light:   "#e2c87a",
        },
        beige: {
          DEFAULT: "#f5ede0",
        },
      },
      animation: {
        fadeUp:  "fadeUp 0.5s ease both",
        fadeIn:  "fadeIn 0.35s ease both",
        slideIn: "slideIn 0.4s ease both",
      },
      keyframes: {
        fadeUp:  { "0%": { opacity:0, transform:"translateY(16px)" }, "100%": { opacity:1, transform:"translateY(0)" } },
        fadeIn:  { "0%": { opacity:0 }, "100%": { opacity:1 } },
        slideIn: { "0%": { opacity:0, transform:"translateX(24px)" }, "100%": { opacity:1, transform:"translateX(0)" } },
      },
    },
  },
  plugins: [],
};
