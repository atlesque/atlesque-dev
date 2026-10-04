# Atlesque.dev

Source for [atlesque.dev](https://atlesque.dev), a personal software development portfolio. It is a static site built with [Astro](https://astro.build) 5, Tailwind CSS and SCSS.

## Requirements

- Node 24 (see `.nvmrc`)
- pnpm 11 (pinned in `package.json` via `packageManager`; enable it with `corepack enable`)

## Getting started

```bash
# install dependencies
pnpm install

# start the dev server with hot reload at http://localhost:4321
pnpm dev

# lint JavaScript/Astro (ESLint) and styles (Stylelint)
pnpm lint

# build the static site into dist/
pnpm build

# preview the production build locally
pnpm start
```

## Where things live

- `src/data/homepage.ts` holds the homepage content (types and data). Edit this file to change what the homepage shows.
- `src/pages/` has the routes: `index.astro` and `404.astro`.
- `src/layouts/` and `src/components/` contain the shared layout and UI components.
- `src/styles/` has the global styles.
- `public/` holds static assets served as-is.
- `astro.config.mjs` configures the site (static output, Tailwind integration).
