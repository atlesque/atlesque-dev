const tailwindAtRules = ["tailwind", "screen", "apply", "layer", "config", "responsive", "variants"];

module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recommended-scss"],
  overrides: [
    {
      // Lint the <style> blocks inside Astro components
      files: ["**/*.astro"],
      customSyntax: "postcss-html",
      rules: {
        // Also applies to single-declaration inline style="--i: 2" attributes
        "custom-property-empty-line-before": null,
      },
    },
  ],
  rules: {
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": [true, { ignoreAtRules: tailwindAtRules }],
    // Tailwind's theme() function isn't known to the CSS value parser
    "declaration-property-value-no-unknown": null,
    // Extending real classes (e.g. .button-primary extends .button) is intentional
    "scss/at-extend-no-missing-placeholder": null,
    // Astro's scoped-style escape hatch
    "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global"] }],
    // kebab-case with optional BEM __element / --modifier suffixes
    "selector-class-pattern": [
      "^[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
      { message: "Expected class selector to be kebab-case (BEM suffixes allowed)" },
    ],
  },
};
