// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Building pages are generated from src/data/buildings.json (see scripts/export-building-data.mjs),
// so the sidebar is built from the same file.
const { buildings } = JSON.parse(readFileSync(new URL('./src/data/buildings.json', import.meta.url), 'utf8'));
const buildingItems = (/** @type {string} */ category) =>
	buildings
		.filter((/** @type {{ category: string }} */ b) => b.category === category)
		.map((/** @type {{ type: string }} */ b) => ({ slug: `buildings/${b.type.split('_').join('-')}` }));

// https://astro.build/config
export default defineConfig({
	site: 'https://sniper45yt.github.io',
	base: '/crowns-of-the-holy-land-wiki',
	integrations: [
		starlight({
			title: 'Crowns of the Holy Land',
			sidebar: [
				{
					label: 'Getting started',
					items: [{ autogenerate: { directory: 'getting-started' } }],
				},
				{
					label: 'Combat',
					items: [{ autogenerate: { directory: 'combat' } }],
				},
				{
					label: 'Buildings',
					items: [
						{ label: 'Overview', slug: 'buildings' },
						{ label: 'Core', items: buildingItems('core') },
						{ label: 'Economy', items: buildingItems('economic') },
						{ label: 'Military', items: buildingItems('military') },
					],
				},
				{
					label: 'Game systems',
					items: [{ autogenerate: { directory: 'game-systems' } }],
				},
			],
		}),
	],
});
