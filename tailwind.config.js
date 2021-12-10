module.exports = {
  mode: "jit",
  purge: ["./content/**/*.md"], // Whitelist classes used in Markdown files
  theme: {
    colors: {
      /*
        Base colours
      */
      white: "#ffffff",
      "gray-light": "#E6E7E8",
      "gray-extra-light": "#F9F9F9",
      black: "#0E0A06",
      /* 
        Primary colours
      */
      red: "#F3665B",
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
    },
    /* 
      Custom fonts
    */
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      serif: ["'Libre Baskerville'", "serif"],
    },
  },
  plugins: [],
};
