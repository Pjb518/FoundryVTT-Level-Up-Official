import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import * as utils from './helpers.mjs';
import { MigrationRunnerCompendium } from '../src/migration/runner/compendiumRunner';
import { MigrationList } from '../src/migration/MigrationList';

// ---------------------------------------------------
//             Setup Foundry utils
// ---------------------------------------------------
// biome-ignore lint/style/noVar: <explanation>
var foundry = {
	utils: {
		deepClone: utils.deepClone,
		duplicate: utils.deepClone,
		expandObject: utils.expandObject,
		flattenObject: utils.flattenObject,
		getProperty: utils.getProperty,
		getType: utils.getType,
		isEmpty: utils.isEmpty$1,
		mergeObject: utils.mergeObject,
		setProperty: utils.setProperty,
	},
};

// ---------------------------------------------------
//
// ---------------------------------------------------

console.log('[INFO] - Starting migration process.');

// Data paths setup
const dirName = url.fileURLToPath(new URL('.', import.meta.url));
const dataPath = path.resolve(dirName, '../packs');
const dirPaths = fs
	.readdirSync(dataPath)
	.map((name) => path.resolve(dirName, dataPath, name))
	.filter((name) => !name.endsWith('json'));

console.log(dirPaths);

// Create migration runner
const CURRENT_VERSION = MigrationRunnerCompendium.LATEST_MIGRATION_VERSION;
console.log(CURRENT_VERSION);

const migrationList = MigrationList.constructFromLatestVersion(CURRENT_VERSION);
const migrationRunner = new MigrationRunnerCompendium(migrationList);

await migrationRunner.runMigration(dirPaths[0]);

for (const dirPath of dirPaths) {
}
