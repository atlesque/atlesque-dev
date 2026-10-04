module.exports = {
  mode: "jit",
  content: ["./src/**/*.{astro,js,jsx,ts,tsx}"],
  theme: {
    colors: {
      /*
        Base colours
      */
      white: "#ffffff",
      "gray-light": "#E6E7E8",
      "gray-extra-light": "#F9F9F9",
      "gray-dark": "#5C5650",
      black: "#0E0A06",
      /*
        Primary colours
      */
      red: "#F3665B",
      // Darker shade of red for small text and filled buttons (WCAG AA on white)
      "red-dark": "#C93A2F",
      "red-light": "#FDE3E0",
      blue: "#577590",
      /*
        Utility
      */
      transparent: "transparent",
      current: "currentColor",
    },
    fontSize: {
      /*
        Type scale: https://bit.ly/3yAyui5
        Format: [fontSize, lineHeight]
      */
      sm: ["0.8rem", 1.75], // Small - 12.80px
      base: ["1rem", 1.75], // Body - 16.00px
      lg: ["1.25rem", 1.3], // Heading 3 - 20.00px
      xl: ["1.563rem", 1.3], // Heading 2 - 25.00px
      "2xl": ["1.953rem", 1.3], // Heading 1 - 31.25px
      "3xl": ["2.441rem", 1.3], // Headlines - 39.06px
      "4xl": ["3.052rem", 1.3], // XL-Headlines - 48.83px
      "5xl": ["3.815rem", 1.15], // Hero - 61.04px
    },
    /*
      Custom fonts
    */
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      serif: ["'Libre Baskerville'", "serif"],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Consolas",
        "'Liberation Mono'",
        "monospace",
      ],
    },
    extend: {
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.25, 0.8, 0.25, 1)",
      },
    },
  },
  plugins: [],
};
