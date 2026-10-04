import type { ImageMetadata } from "astro";

const assets = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/**/*.{png,jpg,jpeg}",
  { eager: true },
);

/**
 * Resolves a site path like "/images/books/clean-code.png" to the matching
 * file in src/assets/images so it can be optimized by astro:assets.
 */
export function resolveImage(path: string): ImageMetadata {
  const key = `/src/assets${path}`;
  const image = assets[key]?.default;
  if (!image) {
    throw new Error(`Image not found in src/assets: ${path}`);
  }
  return image;
}
