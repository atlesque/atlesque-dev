const SEO_TITLE = "Alexander Van Maele";
const SEO_DESCRIPTION =
  "Freelance software developer from Brugge, Belgium. Front-end development in React, Vue and UI/UX design.";

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  // Public env variables
  publicRuntimeConfig: {},

  // Private env variables
  privateRuntimeConfig: {},

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: SEO_TITLE,
    titleTemplate: "%s | Freelance Software Developer",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: SEO_DESCRIPTION,
      },
      { name: "format-detection", content: "telephone=no" },
      /*
        Open Graph Information
      */
      {
        hid: "og:title",
        property: "og:title",
        content: SEO_TITLE,
        template: "%s | Freelance Software Developer",
      },
      {
        hid: "og:description",
        property: "og:description",
        content: SEO_DESCRIPTION,
      },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: "atlesque.dev",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "https://atlesque.dev/og-image.jpg",
      },
      {
        hid: "og:type",
        property: "og:type",
        content: "website",
      },
      {
        hid: "twitter:card",
        property: "twitter:card",
        content: "summary_large_image",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/css/style.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: "~/plugins/head-metadata.js" }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxtjs/eslint-module",
    // https://go.nuxtjs.dev/stylelint
    "@nuxtjs/stylelint-module",
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
    // https://image.nuxtjs.org
    "@nuxt/image",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/content
    "@nuxt/content",
  ],

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // Enable source maps for debugging in VSCode
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
      }
    },
  },

  // Router config (https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-router)
  router: {
    middleware: "remove-double-slash",
  },
};

