/* eslint-disable import/extensions */
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import url from 'url';

import Pack from './lib/Pack.mjs';
import IdBuilder from './lib/IdBuilder.mjs';

// ---------------------------------------------------
//
// ---------------------------------------------------

console.log('[INFO] - Starting build process.');

const dirName = url.fileURLToPath(new URL('.', import.meta.url));
const dataPath = path.resolve(dirName, '../packs');
const dirPaths = fs.readdirSync(dataPath)
  .map((name) => path.resolve(dirName, dataPath, name));

console.log('[INFO] - Validating and Updating document ids.');
const idBuilder = new IdBuilder();
idBuilder.loadIds();

console.log(`[INFO] - Loading ${dirPaths.length - 1} packs.`);
const packs = dirPaths.reduce((acc, pack) => {
  if (pack.endsWith('json')) return acc;
  acc.push(Pack.loadJSONFiles(pack));
  return acc;
}, []);

console.log(`[INFO] - Loaded ${packs.length} packs.`);

const counts = await Promise.all(packs.map((p) => p.saveAsPack()));
const totalCount = counts.reduce((acc, curr) => acc + curr, 0);

console.log(`[INFO] - Successfully built ${counts.length} packs with a total of ${totalCount} documents.`);
console.log(`[INFO] - ${idBuilder.summary}`);
