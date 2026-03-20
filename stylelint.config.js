module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recommended-scss"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["extend", "tailwind", "screen", "apply", "use"],
      },
    ],
  },
};

