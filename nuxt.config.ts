const SEO_TITLE = "Alexander Van Maele";
const SEO_DESCRIPTION =
  "Freelance software developer from Brugge, Belgium. Front-end development in React, Vue and UI/UX design.";

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",

  // SPA mode (no SSR)
  ssr: false,

  // Global page headers
  app: {
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
          name: "description",
          content: SEO_DESCRIPTION,
        },
        { name: "format-detection", content: "telephone=no" },
        /*
          Open Graph Information
        */
        {
          property: "og:title",
          content: SEO_TITLE,
        },
        {
          property: "og:description",
          content: SEO_DESCRIPTION,
        },
        {
          property: "og:site_name",
          content: "atlesque.dev",
        },
        {
          property: "og:image",
          content: "https://atlesque.dev/og-image.jpg",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  // Global CSS
  css: ["@/assets/css/style.scss"],

  // Modules (unified in Nuxt 3/4)
  modules: ["@nuxt/image", "@nuxtjs/tailwindcss", "@nuxt/eslint"],

  // Router config
  router: {
    middleware: ["remove-double-slash"],
  },

  // Vite configuration
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["import"],
        },
      },
    },
  },
});
