// @ts-check
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      "no-console": "off",
      "no-debugger": "off",
    },
  },
];
