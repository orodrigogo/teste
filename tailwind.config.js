/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      orange: {
        base: "#F24D0D",
        dark: "#C43C08",
      },
      blue: {
        light: "#D7EFF9",
        base: "#5EC5FD",
        dark: "#009CF0",
      },
      white: "#FFFFFF",
      background: "#FBF4F4",
      shape: "#F5EAEA",
      gray: {
        100: "#ADADAD",
        200: "#949494",
        300: "#666666",
        400: "#3D3D3D",
        500: "#1D1D1D",
      },
      danger: "#DC3545",
      success: "#28A745",
    },
    fontSize: {
      "2xs": ["0.625rem", "120%"],
      xs: ["0.75rem", "120%"],
      sm: ["0.875rem", "120%"],
      base: ["1rem", "120%"],
      lg: ["1.125rem", "120%"],
      xl: ["1.5rem", "120%"],
      "2xl": ["1.75rem", "120%"],
    },
    fontFamily: {
      sans: 'Poppins, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      title:
        '"DM Sans", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require("tailwind-scrollbar"),
  ],
};
