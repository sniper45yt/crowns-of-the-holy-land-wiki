// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
					label: 'Game systems',
					items: [{ autogenerate: { directory: 'game-systems' } }],
				},
			],
		}),
	],
});
