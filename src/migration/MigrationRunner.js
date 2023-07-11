/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line no-unused-vars, import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import MigrationBase from './MigrationBase';
import MigrationRunnerBase from './MigrationRunnerBase';
import Progress from '../A5EProgress';

export default class MigrationRunner extends MigrationRunnerBase {
  /**
   * @override
   * @returns {Boolean}
   * */
  needsMigration() {
    return super.needsMigration(game.settings.get('a5e', 'worldSchemaVersion'));
  }

  /**
   * Ensure that an actor or item reflects the current data schema before it is created
   * @param {Object} document
   * @param {Array<MigrationBase>} migrations
   * @returns {Promise<void>}
   */
  static async ensureSchemaVersion(document, migrations) {
    if (migrations.length === 0) return;
    const currentVersion = this.LATEST_SCHEMA_VERSION;

    if ((Number(document.schemaVersion)) || currentVersion > 0) {
      const runner = new this(migrations);
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

      if (updated) document.updateSource(updated);
    }

    document.updateSource({ 'system.schema.version ': currentVersion });
    // Discriminate between item and actor without importing, which would throw errors
    // on the migration test
    if ('items' in document && 'token' in document) {
      for (const item of document.items) {
        if (!item.schemaVersion) {
          item.updateSource({ 'system.schema.version': currentVersion });
        }
      }
    }
  }

  /**
  * Migrate actor or item documents in batches of 50
   * @param {*} collection
   * @param {Array<MigrationBase>} migrations
   * @param {Progress} progress
   * @returns {Promise<void>}
   */
  async #migrateDocuments(collection, migrations, progress) {
    const { documentClass } = collection;
    const pack = 'metadata' in collection ? collection.metadata.id : null;
    const updateGroup = [];

    for (const document of collection.contents) {
      if (updateGroup.length === 50) {
        try {
          await documentClass.updateDocuments(updateGroup, { noHook: true, pack });
          progress?.advance({ by: updateGroup.length });
        } catch (e) {
          console.error(e);
        } finally {
          updateGroup.length = 0;
        }
      }

      const updated = 'items' in document
        ? await this.#migrateActor(migrations, document, { pack })
        : await this.#migrateItem(migrations, document, { pack });

      if (updated) updateGroup.push(updated);
    }

    if (updateGroup.length > 0) {
      try {
        await documentClass.updateDocuments(updateGroup, { noHook: true, pack });
        progress?.advance({ by: updateGroup.length });
      } catch (e) {
        console.warn(e);
      }
    }
  }

  /**
   * Migrate adventure documents
   * @param {*} collection
   * @param {Array<MigrationBase>} migrations
   * @returns {Promise<void>}
   */
  async #migrateAdventureDocuments(collection, migrations) {
    const pack = 'metadata' in collection ? collection.metadata.id : null;

    for (const adventureDoc of collection.contents) {
      const updateGroup = [];
      const actors = [...adventureDoc.actors];
      const items = [...adventureDoc.items];

      // Migrate Adventure Actors
      for (const actor of actors) {
        const updated = await this.#migrateActor(migrations, actor, { pack });
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
        const updated = await this.#migrateItem(migrations, item, { pack });
        if (updated) updateGroup.push(updated);
      }

      try {
        await adventureDoc.update({ items: updateGroup }, { noHook: true, pack });
      } catch (e) {
        console.warn(e);
      }
    }
  }

  /**
   *
   * @param {Array<MigrationBase>} migrations
   * @param {Object} actor
   * @param {Promise<Object>} options
   */
  async #migrateActor(migrations, actor, options = {}) {
    // TODO: Return if up to schema version.
    const { pack } = options;
    const actorData = actor.toObject();
    const updateData = await (() => {
      try {
        return this.getUpdatedActor(actorData, migrations);
      } catch (e) {
        if (e instanceof Error) {
          console.error(`Error thrown while migrating ${item.uuid}: ${e.message}`);
        }
        return null;
      }
    })();

    if ((!updateData)) return null;

    // Update items. TODO: Update Effects in the future
    const baseItems = [...actorData.items];
    const updatedItems = [...updateData.items];

    const itemDiff = this.diffCollection(baseItems, updatedItems);
    if (itemDiff.deleted.length > 0) {
      try {
        const finalDeleted = itemDiff.deleted
          .filter((deleteId) => actor.items.some((item) => item.id === deleteId));
        await actor.deleteEmbeddedDocuments('Item', finalDeleted, { noHook: true, pack });
      } catch (e) {
        console.warn(e);
      }
    }

    if (itemDiff.inserted.length > 0) {
      try {
        await actor.createEmbeddedDocuments('Item', itemDiff.inserted, { noHook: true, pack });
      } catch (e) {
        console.warn(e);
      }
    }

    updateData.items = actor.isToken ? updatedItems : itemDiff.updated;
    return updateData;
  }

  /**
   *
   * @param {Array<MigrationBase>} migrations
   * @param {Object} item
   * @param {Promise<Object>} options
   */
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async #migrateItem(migrations, item, options = {}) {
    const baseData = item.toObject();
    const updateData = await (() => {
      try {
        return this.getUpdatedItem(baseData, migrations);
      } catch (e) {
        if (e instanceof Error) {
          console.error(`Error thrown while migrating ${item.uuid}: ${e.message}`);
        }
        return null;
      }
    })();

    if (!updateData) return null;

    // TODO: Add active effects in the future

    return updateData;
  }

  /**
   * @param {Object} journal
   * @param {Array<MigrationBase>} migrations
   */
  async #migrateWorldJournalEntry(journalEntry, migrations, progress) {
    if (!migrations.some((migration) => !!migration.updateJournalEntry)) return;

    try {
      const updated = await this.getUpdatedJournalEntry(journalEntry.toObject(), migrations);
      const changes = diffObject(journalEntry.toObject(), updated);
      if (Object.keys(changes).length > 0) {
        await journalEntry.update(changes, { noHook: true });
      }
    } catch (e) {
      console.warn(e);
    }

    progress.advance();
  }

  /**
   *
   * @param {Object} macro
   * @param {Array<MigrationBase>} migrations
   */
  async #migrateWorldMacro(macro, migrations) {
    if (!migrations.some((migration) => !!migration.updateMacro)) return;

    try {
      const updateData = await this.getUpdatedMacro(macro.toObject(), migrations);
      const changes = foundry.utils.diffObject(macro.toObject(), updateData);
      if (Object.keys(changes).length > 0) {
        await macro.update(changes, { noHook: true });
      }
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   *
   * @param {Object} token
   * @param {Array<MigrationBase>} migrations
   */
  async #migrateSceneToken(token, migrations) {
    if (!migrations.some((migration) => !!migration.updateToken)) return token.toObject();

    try {
      const tokenData = await this.getUpdatedToken(token, migrations);
      const updateData = diffObject(token.toObject(), tokenData);

      if (Object.keys(updateData).length > 0) {
        try {
          await token.update(updateData, { noHook: true });
        } catch (e) {
          console.warn(e);
        }
      }
      return tokenData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   *
   * @param {Object} user
   * @param {Array<MigrationBase>} migrations
   */
  async #migrateUser(user, migrations) {
    if (!migrations.some((migration) => !!migration.updateUser)) return;

    try {
      const userData = user.toObject();
      const updateData = await this.getUpdatedUser(userData, migrations);
      const changes = diffObject(user.toObject(), updateData);
      if (Object.keys(changes).length > 0) {
        await user.update(changes, { noHook: true });
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   *
   * @param {Object} compendium
   * @returns {Promise<void>}
   */
  async runCompendiumMigration(compendium, legacyMigrate = false) {
    if (!['Adventure', 'Actor', 'Item'].includes(compendium.documentName)) return;

    const progress = new Progress({
      label: localize("A5E.migration.compendium.running"),
      max: compendium.index.size
    });

    const documents = await compendium.getDocuments();
    let lowestSchemaVersion;

    if (legacyMigrate) {
      lowestSchemaVersion = 0.00;
    } else if (compendium.documentName === 'Adventure') {
      lowestSchemaVersion = Math.min(
        MigrationRunnerBase.LATEST_SCHEMA_VERSION,
        ...documents.flatMap((d) => {
          const actors = [...d.items].map((a) => a.system?.schema?.version).filter((a) => !!a);
          const items = [...d.items].map((i) => i.system?.schema?.version).filter((i) => !!i);
          return [...actors, ...items];
        })
      );
    } else {
      lowestSchemaVersion = Math.min(
        MigrationRunnerBase.LATEST_SCHEMA_VERSION,
        ...documents.map((d) => d.system?.schema?.version).filter((d) => !!d)
      );
    }

    const migrations = this.migrations
      .filter((migration) => migration.version > lowestSchemaVersion);

    const wasLocked = compendium.locked;
    if (wasLocked) await compendium.configure({ locked: false });

    if (compendium.documentName === 'Adventure') {
      await this.#migrateAdventureDocuments(compendium, migrations);
    } else await this.#migrateDocuments(compendium, migrations, progress);

    if (wasLocked) await compendium.configure({ locked: true });
    if (progress.value < progress.max) progress.close();
  }

  /**
   *
   * @param {Array<migrations>} migrations
   * @returns {Promise<void>}
   */
  async runMigrations(migrations) {
    if (migrations.length === 0) return;
    console.info(`A5E | Found ${migrations.length} migrations`);

    const progress = new Progress({
      label: localize("A5E.migration.running"),
      max: Math.floor(
        game.actors.size +
        game.items.size +
        game.journal.size +
        game.scenes
          .map((s) => s.tokens.contents)
          .flat()
          .filter((t) => t.actor?.isToken).length
      )
    });

    // Migrate actors && items
    console.info(`A5E | Migrating ${game.actors.size} actors.`);
    await this.#migrateDocuments(game.actors, migrations, progress);

    console.info(`A5E | Migrating ${game.items.size} items.`);
    await this.#migrateDocuments(game.items, migrations, progress);

    // Migrate journal entries
    for (const entry of game.journal) {
      await this.#migrateWorldJournalEntry(entry, migrations, progress);
    }

    // Migrate free form documents
    const promises = [];
    game.macros.forEach((m) => promises.push(this.#migrateWorldMacro(m, migrations)));
    game.users.forEach((u) => promises.push(this.#migrateUser(u, migrations)));

    console.info(`A5E | Migrating ${promises.length} macros & users.`);
    migrations.forEach((migration) => {
      if (migration.migrate) promises.push(migration.migrate());
    });

    await Promise.allSettled(promises);

    console.info(`A5E | Migrating ${game.scenes.size} scenes.`);

    // TODO: Optimize this to be faster
    // Migrate tokens and synthetic actors
    for (const scene of game.scenes) {
      console.info(`A5E | Migrating ${scene.tokens.size} tokens in ${scene.id}.`);
      for (const token of scene.tokens) {
        const { actor } = token;
        if (!actor) continue;

        const wasSuccessful = !!(await this.#migrateSceneToken(token, migrations));
        if (!wasSuccessful) continue;

        // Only migrate if the synthetic actor has replaced data to migrate.
        const deltaSource = token.delta?.source;
        const hasMigratableData = (!!deltaSource && deltaSource.flags?.a5e)
          || ((deltaSource ?? {}).items ?? []).length > 0
          || Object.keys(deltaSource?.system ?? {}).length > 0;

        if (actor.isToken && hasMigratableData) {
          const updateData = await this.#migrateActor(migrations, actor);
          if (updateData) {
            try {
              await actor.update(updateData, { noHook: true });
            } catch (e) {
              console.warn(e);
            }
          }

          progress.advance();
        }
      }
    }

    // Defensive check to ensure the progress bar is closed.
    if (progress.value < progress.max) progress.close();

    // Migrate compendiums
    for (const pack of game.packs) {
      if (pack.metadata.packageType !== 'world') continue;
      if (!['Actor', 'Item'].includes(pack.documentName)) continue;

      ui.notifications.info(localize('A5E.migration.compendium.starting', { packName: pack.metadata.label }));
      console.info(`A5E | Migrating ${pack.index.size} documents in ${pack.metadata.id}.`);

      await this.runCompendiumMigration(pack, progress);
      ui.notifications.info(localize('A5E.migration.compendium.finished', { packName: pack.metadata.label }));
    }
  }

  /**
   *
   * @param {Boolean} force
   * @returns {Promise<void>}
   */
  async runMigration(force = false) {
    const schemaVersion = {
      latest: MigrationRunner.LATEST_SCHEMA_VERSION,
      current: game.settings.get('a5e', 'worldSchemaVersion')
    };
    const systemVersion = game.system.version;

    ui.notifications.info(localize('A5E.migration.starting', { version: systemVersion }), {
      permanent: true
    });

    const migrationsToRun = force
      ? this.migrations
      : this.migrations.filter((x) => schemaVersion.current < x.version);

    // We need to break the migration into phases sometimes.
    // for instance, if a migration creates an item, we need to push that to
    // the foundry backend in order to get an id for the item.
    // This way if a later migration depends on the item actually being created,
    // it will work.
    const migrationPhases = [[]];
    for (const migration of migrationsToRun) {
      migrationPhases[migrationPhases.length - 1].push(migration);
      if (migration.requiresFlush) {
        migrationPhases.push([]);
      }
    }

    for (const migrationPhase of migrationPhases) {
      if (migrationPhase.length > 0) {
        await this.runMigrations(migrationPhase);
      }
    }

    ui.notifications.info(localize('A5E.migration.finished', { version: systemVersion }), {
      permanent: true
    });

    await game.settings.set('a5e', 'worldSchemaVersion', schemaVersion.latest);

    // Legacy Support
    await game.settings.set('a5e', 'systemMigrationVersion', game.system.version);
  }
}
