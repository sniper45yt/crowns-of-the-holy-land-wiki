// Exports building cost / build-time / effect data from the game's engine code
// into src/data/buildings.json, which the wiki renders at build time.
//
// Usage: node scripts/export-building-data.mjs <path-to-game-repo>
//
// Run it again whenever the game's buildings are rebalanced, then commit the
// updated JSON. The wiki build itself never needs the game repo.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';

const gameRepo = process.argv[2];
if (!gameRepo || !fs.existsSync(path.join(gameRepo, 'src/engine/buildings.ts'))) {
  console.error('Usage: node scripts/export-building-data.mjs <path-to-game-repo>');
  process.exit(1);
}
const engine = path.resolve(gameRepo, 'src/engine').split(path.sep).join('/');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cothl-wiki-'));
const entry = path.join(tmp, 'entry.ts');
fs.writeFileSync(
  entry,
  `export * from '${engine}/buildings';
export * from '${engine}/buildingConfig';
export * from '${engine}/warehouseConfig';
export * from '${engine}/hospital';
`,
);

const bundle = await rolldown({ input: entry, platform: 'node', logLevel: 'silent' });
await bundle.write({ file: path.join(tmp, 'out.mjs'), format: 'esm' });
const g = await import(pathToFileURL(path.join(tmp, 'out.mjs')).href);

const RESOURCES = ['gold', 'food', 'stone', 'wood'];
const TRAINING = new Set(['barracks', 'archery_range', 'stable', 'siege_workshop']);
const HOUR = 3600;

// Per-level effect columns, only for buildings that have one.
function effects(type, level) {
  const def = g.BUILDING_DEFINITIONS[type];
  if (def.production && def.storageCapacity) {
    return {
      'Output per hour': Math.round(def.production(level) * HOUR),
      'Storage': Math.round(def.storageCapacity(level)),
    };
  }
  if (TRAINING.has(type)) return { 'Training speed bonus': `${Math.round(g.getTrainingSpeedBonus(level) * 100)}%` };
  switch (type) {
    case 'warehouse': return { 'Protected per resource': g.getWarehouseProtection(level) };
    case 'drill_grounds': return { 'March capacity': level * g.DRILL_GROUNDS_CAPACITY_PER_LEVEL };
    case 'war_hall': return { 'Rally capacity': level * g.WAR_HALL_CAPACITY_PER_LEVEL };
    case 'embassy': return { 'Reinforcement capacity': level * g.EMBASSY_CAPACITY_PER_LEVEL };
    case 'hospital':
      return {
        'Wounded capacity': g.hospitalCapacity(level),
        'Healing speed bonus': `${Math.round(g.healSpeedBonus(level) * 100)}%`,
      };
    default: return {};
  }
}

const buildings = Object.values(g.BUILDING_DEFINITIONS).map((def) => {
  const levels = [];
  for (let level = 1; level <= def.maxLevel; level++) {
    const cost = def.cost(level);
    levels.push({
      level,
      cost: Object.fromEntries(RESOURCES.filter((r) => cost[r]).map((r) => [r, cost[r]])),
      seconds: def.constructionTime(level),
      effects: effects(def.type, level),
    });
  }
  return {
    type: def.type,
    name: def.name,
    description: def.description,
    category: def.category,
    maxLevel: def.maxLevel,
    maxCount: def.maxCount,
    prerequisites: (g.BUILDING_PREREQUISITES[def.type] ?? []).map((p) => ({ ...p })),
    levels,
  };
});

const names = Object.fromEntries(buildings.map((b) => [b.type, b.name]));
const data = { names, buildings };
const out = path.join(root, 'src/data/buildings.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(data, null, 2) + '\n');
fs.rmSync(tmp, { recursive: true, force: true });
// Make sure every building has a page. Existing pages are left alone, so any
// hand-written notes added to them survive a re-export.
const pagesDir = path.join(root, 'src/content/docs/buildings');
fs.mkdirSync(pagesDir, { recursive: true });
for (const b of buildings) {
  const file = path.join(pagesDir, b.type.split('_').join('-') + '.mdx');
  if (fs.existsSync(file)) continue;
  fs.writeFileSync(
    file,
    `---
title: ${b.name}
description: Cost, build time and effect of the ${b.name} at every level from 1 to ${b.maxLevel}.
---

import BuildingTable from '../../../components/BuildingTable.astro';

<BuildingTable type="${b.type}" />
`,
  );
  console.log('Created page for', b.name);
}

console.log(`Wrote ${buildings.length} buildings to ${path.relative(root, out)}`);
