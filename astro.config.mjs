import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://atlesque.dev",
  output: "static",
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

