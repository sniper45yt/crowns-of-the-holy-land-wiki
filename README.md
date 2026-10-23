# Crowns of the Holy Land Wiki

Player documentation for Crowns of the Holy Land, built with [Starlight](https://starlight.astro.build) (Astro).

Live site: https://sniper45yt.github.io/crowns-of-the-holy-land-wiki/

## Writing docs

Pages are Markdown files in `src/content/docs/`. Each folder under it becomes a sidebar section (see `astro.config.mjs`). New pages in an existing folder show up automatically.

Internal links must account for the site's `base` path. Use relative links between pages (for example `../../game-systems/resources/`).

## Building data

The building pages (`src/content/docs/buildings/`) and their cost, build-time and effect tables come from `src/data/buildings.json`, which is exported from the game's engine code. After the game's buildings are rebalanced, regenerate it and commit the result:

```bash
node scripts/export-building-data.mjs <path-to-game-repo>
```

The script also creates a page for any new building. Existing pages are never overwritten, so notes written by hand on a building page survive a re-export. The sidebar is built from the same JSON.

## Local development

```bash
npm install
npm run dev
```

## Deployment

Pushing to `main` builds and deploys the site to GitHub Pages via `.github/workflows/deploy.yml`.
