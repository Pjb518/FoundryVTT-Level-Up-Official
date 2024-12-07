import type { MigrationBase } from '../MigrationBase';

import { MigrationRunnerBase } from './base';
import { localize } from '@typhonjs-fvtt/runtime/util/i18n';

class MigrationRunnerFoundry extends MigrationRunnerBase {
	#sourceData: any;

	override needsMigration(): boolean {
		return super.needsMigration(game.settings.get('a5e', 'worldSchemaVersion') as number);
	}

	static async ensureSchemaVersion(document: any, migrations: MigrationBase[]): Promise<void> {
		if (migrations.length === 0) return;
		const currentVersion = MigrationRunnerFoundry.LATEST_MIGRATION_VERSION;

		if ((Number(document.migrationVersion) || 0) < currentVersion) {
			const runner = new MigrationRunnerFoundry(migrations);
			const source = document._source;

			const updated = await (async () => {
				try {
					return 'items' in source
						? await runner.getUpdatedActor(source, runner.migrations)
						: await runner.getUpdatedItem(source, runner.migrations);
				} catch {
					return null;
				}
			})();

			if (updated) {
				// Ensure new items have IDs and deleted items are removed
				if ('items' in updated && 'items' in document._source) {
					for (const updatedItem of updated.items) {
						updatedItem._id ??= foundry.utils.randomID();
					}

					const itemSources = document._source.items;
					for (const itemSource of [...itemSources]) {
						if (!updated.items.some((i) => i._id === itemSource._id)) {
							itemSources.splice(itemSources.indexOf(itemSource), 1);
						}
					}
				}

				document.updateSource(updated);
			}
		}

		document.updateSource({ 'system._migration.version': currentVersion });

		if ('items' in document && 'prototypeToken' in document) {
			for (const item of document.items) {
				if (!item.migrationVersion) {
					item.updateSource({ 'system._migration.version': currentVersion });
				}
			}
		}
	}

	async #migrateDocuments(collection: any, migrations: MigrationBase[]): Promise<void> {
		const { documentClass } = collection;
		const pack = 'metadata' in collection ? collection.metadata.id : null;
		const updateGroup: any[] = [];

		for (const document of collection.contents) {
			if (updateGroup.length === 50) {
				try {
					await documentClass.updateDocuments(updateGroup, { noHook: true, pack });
				} catch (e) {
					console.error(e);
				} finally {
					// TODO: Update progress bar
					updateGroup.length = 0;
				}
			}

			const updated =
				'prototypeToken' in document
					? await this.#migrateActor(migrations, document, { pack })
					: await this.#migrateItem(migrations, document, { pack });

			if (updated) updateGroup.push(updated);
		}

		if (updateGroup.length > 0) {
			try {
				await documentClass.updateDocuments(updateGroup, { noHook: true, pack });
			} catch (e) {
				// TODO: Update progress bar
				console.warn(e);
			}
		}
	}

	async #migrateAdventureDocuments(collection: any, migrations: MigrationBase[]): Promise<void> {
		const pack = 'metadata' in collection ? collection.metadata.id : null;
		const isAdventure = true;

		for (const adventureDoc of collection.contents) {
			const updateGroup: any[] = [];
			const actors = [...adventureDoc.actors];
			const items = [...adventureDoc.items];

			// Migrate Adventure Actors
			for (const actor of actors) {
				const updated = await this.#migrateActor(migrations, actor, { pack, isAdventure });
				if (updated) updateGroup.push(updated);
			}

			try {
				await adventureDoc.update({ actors: updateGroup }, { noHook: true, pack });
			} catch (e) {
				console.warn(e);
			}

			updateGroup.length = 0;

			// Migrate Adventure Items
			for (const item of items) {
				const updated = await this.#migrateItem(migrations, item, { pack, isAdventure });
				if (updated) updateGroup.push(updated);
			}

			try {
				await adventureDoc.update({ items: updateGroup }, { noHook: true, pack });
			} catch (e) {
				console.warn(e);
			}
		}
	}

	async #migrateActor(
		migrations: MigrationBase[],
		actor: any,
		options?: { isAdventure?: boolean; pack?: string },
	): Promise<any | null> {
		const { pack, isAdventure = false } = options ?? {};
		const baseActor = this.#sourceData.actors?.find((a) => actor._id === a._id) ?? actor.toObject();

		const updatedActor = await (async () => {
			try {
				return await this.getUpdatedActor(baseActor, migrations);
			} catch (error) {
				// Output the error, since this means a migration threw it
				if (error instanceof Error) {
					console.error(`Error thrown while migrating ${actor.uuid}: ${error.message}`);
				}
				return null;
			}
		})();

		if (!updatedActor) return null;

		// Update items
		const baseItems = [...baseActor.items];
		const updatedItems = [...updatedActor.items];

		// We pull out the items here so that the embedded document operations get called
		const itemDiff = this.diffCollection(baseItems, updatedItems);

		const itemsDeleted = itemDiff.deleted.filter((id) => actor.items.has(id));
		if (itemsDeleted.length > 0 && !isAdventure) {
			try {
				await actor.deleteEmbeddedDocuments('Item', itemsDeleted, { noHook: true, pack });
			} catch (error) {
				// Output as a warning, since this merely means data preparation following the update
				// (hopefully intermittently) threw an error
				console.warn(error);
			}
		}

		const itemsUpdated = itemDiff.updated.filter((i) => actor.items.has(i._id!));
		updatedActor.items = [...itemDiff.inserted, ...itemsUpdated];

		// Update effects
		const baseEffects = [...baseActor.effects];
		const updatedEffects = [...updatedActor.effects];

		// We pull out the effects here so that the embedded document operations get called
		const effectDiff = this.diffCollection(baseEffects, updatedEffects);
		const effectsDeleted = effectDiff.deleted.filter((id) => actor.effects.has(id));

		if (effectsDeleted.length > 0 && !isAdventure) {
			try {
				await actor.deleteEmbeddedDocuments('ActiveEffect', effectsDeleted, { noHook: true, pack });
			} catch (error) {
				// Output as a warning, since this merely means data preparation following the update
				// (hopefully intermittently) threw an error
				console.warn(error);
			}
		}

		const effectsUpdated = effectDiff.updated.filter((i) => actor.effects.has(i._id!));
		updatedActor.effects = [...effectDiff.inserted, ...effectsUpdated];

		return updatedActor;
	}

	async #migrateItem(
		migrations: MigrationBase[],
		item: any,
		options?: { isAdventure?: boolean; pack?: string },
	): Promise<any | null> {
		const { pack, isAdventure = false } = options ?? {};
		const baseItem = this.#sourceData.items?.find((i) => i._id === item._id) ?? item.toObject();

		const updatedItem = await (() => {
			try {
				return this.getUpdatedItem(baseItem, migrations);
			} catch (e) {
				if (e instanceof Error) {
					console.error(`Error thrown while migrating ${item.uuid}: ${e.message}`);
				}
				return null;
			}
		})();

		if (!updatedItem) return null;

		// Update effects
		const baseEffects = [...baseItem.effects];
		const updatedEffects = [...updatedItem.effects];

		// We pull out the effects here so that the embedded document operations get called
		const effectDiff = this.diffCollection(baseEffects, updatedEffects);
		const effectsDeleted = effectDiff.deleted.filter((id) => item.effects.has(id));

		if (effectsDeleted.length > 0 && !isAdventure) {
			try {
				await item.deleteEmbeddedDocuments('ActiveEffect', effectsDeleted, { noHook: true, pack });
			} catch (error) {
				// Output as a warning, since this merely means data preparation following the update
				// (hopefully intermittently) threw an error
				console.warn(error);
			}
		}

		const effectsUpdated = effectDiff.updated.filter((i) => item.effects.has(i._id!));
		updatedItem.effects = [...effectDiff.inserted, ...effectsUpdated];

		return updatedItem;
	}

	async #migrateJournalEntry(
		journalEntry: JournalEntry,
		migrations: MigrationBase[],
	): Promise<void> {
		if (!migrations.some((m) => !!m.updateJournalEntry)) return;

		try {
			const updated = await this.getUpdatedJournalEntry(journalEntry.toObject(), migrations);
			const changes = foundry.utils.diffObject(journalEntry.toObject(), updated);

			if (Object.keys(changes).length > 0) {
				await journalEntry.update(changes, { noHook: true });
			}
		} catch (e) {
			console.warn(e);
		}
	}

	async #migrateMacro(macro: Macro, migrations: MigrationBase[]): Promise<void> {
		if (!migrations.some((m) => !!m.updateMacro)) return;

		try {
			const updated = await this.getUpdatedMacro(macro.toObject(), migrations);
			const changes = foundry.utils.diffObject(macro.toObject(), updated);

			if (Object.keys(changes).length > 0) {
				await macro.update(changes, { noHook: true });
			}
		} catch (e) {
			console.warn(e);
		}
	}

	async #migrateTable(table: RollTable, migrations: MigrationBase[]): Promise<void> {
		if (!migrations.some((m) => !!m.updateTable)) return;

		try {
			const updatedMacro = await this.getUpdatedTable(table.toObject(), migrations);
			const changes = foundry.utils.diffObject(table.toObject(), updatedMacro);

			if (Object.keys(changes).length > 0) {
				table.update(changes, { noHook: true });
			}
		} catch (error) {
			console.warn(error);
		}
	}

	async #migrateSceneToken(token: any, migrations: MigrationBase[]): Promise<any | null> {
		if (!migrations.some((migration) => !!migration.updateToken)) return token.toObject();

		try {
			const updatedToken = await this.getUpdatedToken(token, migrations);
			const changes = foundry.utils.diffObject(token.toObject(), updatedToken);

			if (Object.keys(changes).length > 0) {
				try {
					await token.update(changes, { noHook: true });
				} catch (error) {
					console.warn(error);
				}
			}

			return updatedToken;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async #migrateUser(user: User, migrations: MigrationBase[]): Promise<void> {
		if (!migrations.some((migration) => !!migration.updateUser)) return;

		try {
			const baseUser = user.toObject();
			const updatedUser = await this.getUpdatedUser(baseUser, migrations);
			const changes = foundry.utils.diffObject(user.toObject(), updatedUser);
			if (Object.keys(changes).length > 0) {
				await user.update(changes, { noHook: true });
			}
		} catch (error) {
			console.error(error);
		}
	}

	async runCompendiumMigration(
		migrations: MigrationBase[],
		pack: CompendiumCollection<CompendiumCollection.Metadata>,
	): Promise<void> {
		if (!['Adventure', 'Actor', 'Item'].includes(pack.documentName)) return;

		// TODO: Progress Marker

		// Load Documents
		await pack.getDocuments();

		const wasLocked = pack.locked;
		if (wasLocked) await pack.configure({ locked: false });

		if (pack.documentName === 'Adventure') {
			await this.#migrateAdventureDocuments(pack, migrations);
		} else {
			await this.#migrateDocuments(pack, migrations);
		}

		if (wasLocked) await pack.configure({ locked: true });
	}

	async runMigrations(migrations: MigrationBase[]): Promise<void> {
		if (migrations.length === 0) return;

		// TODO: Progress marker

		// Migrate Actors
		await this.#migrateDocuments(game.actors, migrations);

		// Migrate Items
		await this.#migrateDocuments(game.items, migrations);

		// Update tiny docs
		const promises: Promise<unknown>[] = [];

		game.journal.forEach((e) => promises.push(this.#migrateJournalEntry(e, migrations)));
		game.macros.forEach((m) => promises.push(this.#migrateMacro(m, migrations)));
		game.tables.forEach((t) => promises.push(this.#migrateTable(t, migrations)));
		game.users.forEach((u) => promises.push(this.#migrateUser(u, migrations)));

		// General Free Form Updates
		migrations.forEach((m) => {
			if (m.migrate) promises.push(m.migrate());
		});

		await Promise.allSettled(promises);

		// Migrate Tokens
		for (const scene of game.scenes) {
			for (const token of scene.tokens) {
				const { actor } = token;
				if (!actor) continue;

				const wasSuccess = !!(await this.#migrateSceneToken(token, migrations));
				if (!wasSuccess) continue;

				const deltaSource = token.delta?._source;
				const hasMigratableData =
					(!!deltaSource && !!deltaSource.flags?.a5e) ||
					(deltaSource?.items ?? []).length > 0 ||
					Object.keys(deltaSource?.system ?? {}).length > 0;

				if (actor.isToken) {
					if (hasMigratableData) {
						const updated = await this.#migrateActor(migrations, actor);
						if (updated) {
							try {
								await actor.update(updated, { noHook: true });
							} catch (error) {
								console.warn(error);
							}
						}
					}
				}
			}
		}

		// Migrate compendiums
		for (const pack of game.packs) {
			if (pack.metadata.packageType !== 'world') continue;
			if (!['Actor', 'Item'].includes(pack.documentName)) continue;

			ui.notifications.info(
				localize('A5E.migration.compendium.starting', { packName: pack.metadata.label }),
			);

			console.info(`A5E | Migrating ${pack.index.size} documents in ${pack.metadata.id}.`);
			await this.runCompendiumMigration(migrations, pack);
			ui.notifications.info(
				localize('A5E.migration.compendium.finished', { packName: pack.metadata.label }),
			);
		}
	}

	async runMigration(force = false): Promise<void> {
		const migrationVersion = {
			latest: MigrationRunnerFoundry.LATEST_MIGRATION_VERSION,
			current: game.settings.get('a5e', 'worldSchemaVersion') as number,
		};

		const systemVersion = game.system.version;

		ui.notifications.info(localize('A5E.migration.world.starting', { version: systemVersion }));

		const migrationsToRun = force
			? this.migrations
			: this.migrations.filter((m) => migrationVersion.current < m.version);

		const migrationPhases: MigrationBase[][] = [[]];

		for (const migration of migrationsToRun) {
			migrationPhases[migrationPhases.length - 1].push(migration);
			if (migration.requiresFlush) {
				migrationPhases.push([]);
			}
		}

		await this.#setupSourceData();
		console.log(this.#sourceData);
		// return;

		for (const phase of migrationPhases) {
			if (phase.length > 0) await this.runMigrations(phase);
		}

		await game.settings.set('a5e', 'worldSchemaVersion', migrationVersion.latest);
	}

	async #setupSourceData() {
		const socket = await Game.connect(game.sessionId);
		this.#sourceData = await Game.getData(socket, 'game');

		// TODO: Might need to close this socket.

		return;
	}
}

export { MigrationRunnerFoundry };
