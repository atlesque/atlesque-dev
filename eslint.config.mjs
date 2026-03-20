// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/no-v-html": "off",
  },
});
