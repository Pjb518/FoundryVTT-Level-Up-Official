import fs from 'node:fs';
import { MigrationRunnerBase } from './base';

class MigrationRunnerCompendium extends MigrationRunnerBase {
	#isActor(doc: Record<string, any>): boolean {
		return 'system' in doc && doc.system && 'items' in doc && Array.isArray(doc.items);
	}

	#isItem(doc: Record<string, any>): boolean {
		return 'system' in doc && doc.system && !this.#isActor(doc) && !('text' in doc);
	}

	#isJournal(doc: Record<string, any>): boolean {
		return 'pages' in doc;
	}

	#isRollTable(doc: Record<string, any>): boolean {
		return 'results' in doc;
	}

	#getFiles(dirPath: string) {
		// @ts-expect-error
		const filenames = fs.globSync(`${dirPath}/**/*.json`);
		const files = new Map<string, Record<string, any>>();

		for (const file of filenames) {
			let data: Record<string, any>;
			try {
				data = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }).toString());
			} catch (err) {
				console.error(err);
				console.warn(`[ERROR] - ${file} failed to parse.`);
				continue;
			}

			files.set(file, data);
		}

		return files;
	}

	#toFixedJSON(source: Record<string, any>): string {
		const content = JSON.stringify(
			source,
			(key, value) => {
				if (key.startsWith('-=') || key.includes('.-=')) return;
				return value;
			},
			'\t',
		);

		return `${content}\n`;
	}

	async getUpdatedSource(source: Record<string, any>): Promise<Record<string, any>> {
		if (this.#isActor(source)) {
			const update = await this.getUpdatedActor(source, this.migrations);
			update.items = update.items.map((i) =>
				foundry.utils.mergeObject({}, i, { performDeletions: true }),
			);
			update.effects = update.effects.map((e) =>
				foundry.utils.mergeObject({}, e, { performDeletions: true }),
			);

			return foundry.utils.mergeObject(source, update, { inplace: false, performDeletions: true });
		}

		if (this.#isItem(source)) {
			const update = await this.getUpdatedItem(source, this.migrations);
			update.effects = update.effects.map((e) =>
				foundry.utils.mergeObject({}, e, { performDeletions: true }),
			);

			return foundry.utils.mergeObject(source, update, { inplace: false, performDeletions: true });
		}

		if (this.#isJournal(source)) {
			const update = await this.getUpdatedJournalEntry(source, this.migrations);
			return foundry.utils.mergeObject(source, update, { inplace: false, performDeletions: true });
		}

		if (this.#isRollTable(source)) {
			const update = await this.getUpdatedTable(source, this.migrations);
			return foundry.utils.mergeObject(source, update, { inplace: false, performDeletions: true });
		}

		return source;
	}

	async runMigration(dirPath: string) {
		const files = this.#getFiles(dirPath);

		for (const [filePath, source] of files.entries()) {
			let updated: Record<string, any>;
			try {
				updated = await this.getUpdatedSource(source);
			} catch (err) {
				console.error(err);
				console.warn(`[ERROR] - ${filePath} failed to migrate.`);
				return;
			}

			// Write to file
			if (!foundry.utils.objectsEqual(source, updated)) {
				fs.writeFileSync(filePath, this.#toFixedJSON(updated), { encoding: 'utf-8' });
			}
		}
	}
}

export { MigrationRunnerCompendium };
