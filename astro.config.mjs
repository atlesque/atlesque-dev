import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://atlesque.dev",
  output: "static",
  build: {
    // Inline CSS to avoid render-blocking stylesheet requests
    inlineStylesheets: "always",
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          silenceDeprecations: ["import"],
        },
      },
    },
  },
});

