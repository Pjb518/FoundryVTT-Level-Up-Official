import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import * as utils from './helpers.mjs';
import { MigrationRunnerCompendium } from '../src/migration/runner/compendiumRunner';
import { MigrationList } from '../src/migration/MigrationList';

// ---------------------------------------------------
//             Setup Foundry utils
// ---------------------------------------------------
globalThis.foundry = {
	// @ts-expect-error
	utils: {
		deepClone: utils.deepClone,
		duplicate: utils.deepClone,
		expandObject: utils.expandObject,
		flattenObject: utils.flattenObject,
		getProperty: utils.getProperty,
		getType: utils.getType,
		isEmpty: utils.isEmpty$1,
		mergeObject: utils.mergeObject,
		objectsEqual: utils.objectsEqual,
		setProperty: utils.setProperty,
	},
};

// ---------------------------------------------------
//
// ---------------------------------------------------

console.log('[INFO] - Starting migration process.');

console.log('[INFO] - Getting Files...');
// Data paths setup
const dirName = url.fileURLToPath(new URL('.', import.meta.url));
const dataPath = path.resolve(dirName, '../packs');
const dirPaths = fs
	.readdirSync(dataPath)
	.map((name) => path.resolve(dirName, dataPath, name))
	.filter((name) => !name.endsWith('json'));

// Create migration runner
const CURRENT_VERSION = MigrationRunnerCompendium.LATEST_MIGRATION_VERSION;

const migrationList = MigrationList.constructFromLatestVersion(CURRENT_VERSION);
const migrationRunner = new MigrationRunnerCompendium(migrationList);

console.log(`[INFO] - Migrating to version ${CURRENT_VERSION}...`);

for (const dirPath of dirPaths) {
	console.log(`[INFO] - Running Migration for ${dirPath.split('\\').at(-1)}...`);
	await migrationRunner.runMigration(dirPaths[0]);
}

console.log(`[INFO] - Successfully Migrated to version ${CURRENT_VERSION}.`);
