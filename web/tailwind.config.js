/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      letterSpacing: {
        tightest: "-.075em",
        ...defaultTheme.letterSpacing,
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
        "3xl": "6rem",
      },
      fontFamily: {
        sans: ["Mulish", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  daisyui: {
    themes: false, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themes: [
      {
        light: {
          primary: "#057a8c",
          secondary: "#85a7d1",
          accent: "#71d151",
          neutral: "#171921",
          "base-100": "#ebeaf0",
          "base-content": "black",
          info: "#9ce1f2",
          success: "#7ae1c0",
          warning: "#f0a62d",
          error: "#ee614f",
          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.25rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-text-case": "uppercase", // set default text transform for buttons
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs
        },
      },
    ],
  },

  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
