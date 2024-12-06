import type { MigrationBase } from './MigrationBase.ts';

interface CollectionDiff<T = any> {
	inserted: T[];
	deleted: string[];
	updated: T[];
}

interface MigrationRecord {
	version: number | null;
	type: string; // TODO: Update this to be better
	lastMigration: {
		version: number | null;
		system: string;
		foundry: string;
	} | null;
}

class MigrationRunnerBase {
	migrations: MigrationBase[];

	static LATEST_SCHEMA_VERSION = 0;

	static RECOMMENDED_SAFE_VERSION = 0;

	static MINIMUM_SAFE_VERSION = 0;

	constructor(migrations?: MigrationBase[]) {
		if (!migrations) migrations = [];
		this.migrations = migrations.sort((a, b) => a.version - b.version);
	}

	needsMigration(currentVersion: number): boolean {
		return currentVersion < MigrationRunnerBase.LATEST_SCHEMA_VERSION;
	}

	diffCollection(original: any[], updated: any[]): CollectionDiff {
		const diffs: CollectionDiff = {
			inserted: [],
			deleted: [],
			updated: [],
		};

		const originalSources: Map<string, any> = new Map();
		original.forEach((source) => originalSources.set(source._id, source));

		updated.forEach((source) => {
			const originalSource = originalSources.get(source._id);
			if (originalSource) {
				if (JSON.stringify(originalSource) !== JSON.stringify(source)) {
					diffs.updated.push(source);
				}

				originalSources.delete(source._id);
			} else {
				diffs.inserted.push(source);
			}
		});

		originalSources.forEach((source) => diffs.deleted.push(source._id));

		return diffs;
	}

	async getUpdatedActor(actor: any, migrations: MigrationBase[]): Promise<any> {
		// TODO: Maybe Change this to use the true source
		const actorData = foundry.utils.deepClone(actor);

		for (const migration of migrations) {
			try {
				await migration?.updateActor?.(actorData);

				for (const item of actorData.items) {
					try {
						await migration?.updateItem?.(item, actorData);
					} catch (e) {
						console.info(`Actor ${actorData.name} failed items update.`);
						console.error(e);
					}
				}

				for (const effect of actorData.effects) {
					try {
						await migration.updateEffect?.(effect, actorData);
					} catch (e) {
						console.info(`Actor ${actorData.name} failed effects update.`);
						console.error(e);
					}
				}
			} catch (e) {
				console.info(`Actor ${actorData.name} failed actor update.`);
				console.error(e);
			}
		}

		if ('game' in globalThis) {
			const latestMigration = migrations.at(-1)!;
			// TODO: Update schema
		}

		return actorData;
	}

	async getUpdatedItem(item: any, migrations: MigrationBase[]): Promise<any> {
		// TODO: Maybe Change this to use the true source
		const itemData = foundry.utils.deepClone(item);

		try {
			for (const migration of migrations) {
				await migration?.updateItem?.(itemData);

				for (const effect of itemData.effects) {
					try {
						await migration?.updateEffect?.(effect, itemData);
					} catch (e) {
						console.info(`Item ${itemData.name} failed effects update.`);
						console.error(e);
					}
				}
			}
		} catch (e) {
			console.info(`Item ${itemData.name} failed item update.`);
			console.error(e);
		}

		if (migrations.length > 0) {
			// TODO: Update Schema version
		}

		return itemData;
	}

	async getUpdatedJournalEntry(source: any, migrations: MigrationBase[]): Promise<any> {
		const journalData = foundry.utils.deepClone(source);

		for (const migration of migrations) {
			try {
				await migration.updateJournalEntry?.(journalData);
			} catch (err) {
				console.error(err);
			}
		}

		return journalData;
	}

	async getUpdatedTable(tableSource: any, migrations: MigrationBase[]): Promise<any> {
		const tableData = foundry.utils.deepClone(tableSource);

		for (const migration of migrations) {
			try {
				await migration.updateTable?.(tableData);
			} catch (err) {
				console.error(err);
			}
		}

		return tableData;
	}

	async getUpdatedMacro(macroSource: any, migrations: MigrationBase[]): Promise<any> {
		const marcoData = foundry.utils.deepClone(macroSource);

		for (const migration of migrations) {
			try {
				await migration.updateMacro?.(marcoData);
			} catch (err) {
				console.error(err);
			}
		}

		return marcoData;
	}

	async getUpdatedToken(token: any, migrations: MigrationBase[]): Promise<any> {
		const tokenData = token.toObject();

		for (const migration of migrations) {
			try {
				await migration.updateToken?.(tokenData, token.actor, token.scene);
			} catch (e) {
				console.info(`Token ${tokenData.name} failed token update on scene ${token.scene.id}.`);
				console.error(e);
			}
		}

		return tokenData;
	}

	async getUpdatedUser(user: any, migrations: MigrationBase[]) {
		const userData = foundry.utils.deepClone(user);

		for (const migration of migrations) {
			try {
				await migration?.updateUser?.(userData);
			} catch (e) {
				console.info(`User ${userData.name} failed user update.`);
				console.error(e);
			}
		}

		return userData;
	}

	#updateMigrationRecord(
		type: string,
		migration = {} as MigrationRecord,
		latestMigration: MigrationBase | null = null,
	) {
		if (!('game' in globalThis && latestMigration)) return;

		const fromVersion = typeof migration?.version === 'number' ? migration.version : null;
		migration.version = latestMigration?.version;

		migration.lastMigration = {
			version: fromVersion,
			// @ts-expect-error
			foundry: game.version,
			system: game.system.version,
		};
	}
}

export { MigrationRunnerBase };
