/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line no-unused-vars, import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

// eslint-disable-next-line no-unused-vars
import MigrationBase from './MigrationBase';
import MigrationRunnerBase from './MigrationRunnerBase';

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
   * @returns {Promise<void>}
   */
  async #migrateDocuments(collection, migrations) {
    const { documentClass } = collection;
    const pack = 'metadata' in collection ? collection.metadata.id : null;
    const updateGroup = [];

    for (const document of collection.contents) {
      if (updateGroup.length === 50) {
        try {
          await documentClass.updateDocuments(updateGroup, { noHook: true, pack });
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
  }

  /**
   *
   * @param {Array<MigrationBase>} migrations
   * @param {Object} actor
   * @param {Promise<Object>} options
   */
  async #migrateActor(migrations, actor, options = {}) {
    const { pack } = options;
    const actorData = actor.toObject();
    const updateData = await (() => {
      try {
        return this.getUpdatedActor(actorData, migrations);
      } catch (e) {
        console.error(e);
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
  // eslint-disable-next-line no-unused-vars
  async #migrateItem(migrations, item, options = {}) {
    const baseData = item.toObject();
    const updateData = await (() => {
      try {
        return this.getUpdatedItem(baseData, migrations);
      } catch (e) {
        console.error(e);
        return null;
      }
    })();

    if (!updateData) return null;

    // TODO: Add active effects in the future

    return updateData;
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
   * @param {*} compendium
   * @returns {Promise<void>}
   */
  async runCompendiumMigration(compendium) {
    ui.notifications.info(localize('A5E.MigrationStarting', { version: game.system.version }), {
      permanent: true
    });

    const documents = await compendium.getDocuments();
    const lowestSchemaVersion = Math.min(
      MigrationRunnerBase.LATEST_SCHEMA_VERSION,
      ...documents.map((d) => d.system?.schema?.version).filter((d) => !!d)
    );

    const migrations = this.migrations
      .filter((migration) => migration.version > lowestSchemaVersion);

    await this.#migrateDocuments(compendium, migrations);

    ui.notifications.info(localize('A5E.MigrationFinished', { version: game.system.version }), {
      permanent: true
    });
  }

  /**
   *
   * @param {Array<migrations>} migrations
   * @returns {Promise<void>}
   */
  async runMigrations(migrations) {
    if (migrations.length === 0) return;

    // Migrate actors && items
    await this.#migrateDocuments(game.actors, migrations);
    await this.#migrateDocuments(game.items, migrations);

    // Migrate free form documents
    const promises = [];
    game.macros.forEach((m) => promises.push(this.#migrateWorldMacro(m, migrations)));
    game.users.forEach((u) => promises.push(this.#migrateUser(u, migrations)));

    migrations.forEach((migration) => {
      if (migration.migrate) promises.push(migration.migrate());
    });

    await Promise.allSettled(promises);

    // Migrate tokens and synthetic actors
    for (const scene of game.scenes) {
      for (const token of scene.tokens) {
        const { actor } = token;
        if (!actor) continue;

        const wasSuccessful = !!(await this.#migrateSceneToken(token, migrations));
        if (!wasSuccessful) continue;

        // Only migrate if the synthetic actor has replaced data to migrate.
        const hasMigratableData = !!token._source.actorData.flags?.a5e
          || Object.keys(token._source.actorData).some((k) => ['items', 'system'].includes(k));

        if (actor.isToken && hasMigratableData) {
          const updateData = await this.#migrateActor(migrations, actor);
          if (updateData) {
            try {
              await actor.update(updateData);
            } catch (e) {
              console.warn(e);
            }
          }
        }
      }
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

    ui.notifications.info(localize('A5E.MigrationStarting', { version: systemVersion }), {
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

    ui.notifications.info(localize('A5E.MigrationFinished', { version: systemVersion }), {
      permanent: true
    });
  }
}
