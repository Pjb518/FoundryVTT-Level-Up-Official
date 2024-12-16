import fs from 'node:fs';
import path from 'node:path';

import { globSync } from 'glob';
import LevelDatabase from './LevelDB.mjs';
import systemJSON from '../../public/system.json' with { type: 'json' };

export default class Pack {
	static #PACK_DEST = path.resolve(process.cwd(), 'public/packs');

	static #packsMetadata = systemJSON.packs;

	constructor(dirName, data) {
		const metadata = Pack.#packsMetadata.find(
			(p) => path.basename(p.path).split('.')[0] === path.basename(dirName),
		);

		if (!metadata) throw Error(`[ERROR] - Pack ${dirName} isn't setup in system.json.`);

		/** @type {string} */
		this.systemId = metadata.system;
		/** @type {string} */
		this.packId = metadata.name;
		/** @type {string} */
		this.documentType = metadata.type;

		/** @type {string} */
		this.dirPath = dirName;
		/** @type {string} */
		this.dirName = path.basename(dirName);
		/** @type {Map<string, any>} */
		this.data = data;
	}

	cleanAndValidate() {
		[...this.data.entries()].map(([file, source]) => {
			this.#cleanDocument(source);
			fs.writeFileSync(file, JSON.stringify(source, null, '\t'), { encoding: 'utf-8' });

			return source;
		});
	}

	#cleanDocument(source) {
		// Clean Flags
		if (!source.flags) source.flags = {};
		delete source.flags?.exportSource;
		delete source.flags?.importSource;

		Object.entries(source.flags).forEach(([flagId, flag]) => {
			if (!['core', 'a5e'].includes(flagId)) delete source.flags[flagId];

			if (Object.keys(flag).length === 0) delete source.flags[flag];
		});

		// TODO: Make this more robust in the future
		if (this.documentType !== 'RollTable') source.folder = null;

		// Reset ownership data
		if (source.ownership) delete source.ownership;

		// Update _stats data
		// const stats = {
		//   coreVersion: systemJSON.compatibility.minimum,
		//   systemId: systemJSON.id,
		//   systemVersion: systemJSON.version
		// };
		// source._stats = stats;

		// TODO: Update migration data

		// Recurse for sub documents
		if (Array.isArray(source?.effects)) source.effects.forEach((e) => this.#cleanDocument(e));
		if (Array.isArray(source?.items)) source.items.forEach((i) => this.#cleanDocument(i));
	}

	async saveAsPack() {
		if (!fs.lstatSync(Pack.#PACK_DEST, { throwIfNoEntry: false })?.isDirectory()) {
			fs.mkdirSync(Pack.#PACK_DEST);
		}

		const outDir = path.join(Pack.#PACK_DEST, this.dirName);
		if (fs.lstatSync(outDir, { throwIfNoEntry: false })?.isDirectory()) {
			fs.rmSync(outDir, { recursive: true });
		}

		this.cleanAndValidate();

		const db = new LevelDatabase(outDir, { packName: this.dirName });
		await db.createPack([...this.data.values()]);
		const count = this.data.size;

		console.log(`[INFO] - Pack "${this.packId}" with ${count} documents built successfully.`);

		return count;
	}

	saveAsJSON() {}

	static loadJSONFiles(dirPath) {
		const filenames = globSync(`${dirPath}/**/*.json`);
		const files = new Map();

		for (const file of filenames) {
			let jsonData;

			try {
				jsonData = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }).toString());
			} catch (err) {
				console.error(err);
				console.warn(`[ERROR] - ${file} failed to parse.`);
				continue;
			}

			if (!jsonData) continue;

			files.set(file, jsonData);
		}

		return new Pack(dirPath, files);
	}
}
