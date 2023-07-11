/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import MigrationBase from './MigrationBase';

export default class MigrationRunnerBase {
  static LATEST_SCHEMA_VERSION = 0.005;

  static MIN_SAFE_VERSION = 0;

  static RECOMMENDED_SAFE_VERSION = 0;

  /**
   *
   * @param {Array<MigrationBase>} migrations
   */
  constructor(migrations) {
    /** @type {Array<MigrationBase>} */
    this.migrations = migrations.sort((a, b) => a.version - b.version);
  }

  /**
   *
   * @param {Number} currentVersion
   * @returns {Boolean}
   */
  needsMigration(currentVersion) {
    return currentVersion < MigrationRunnerBase.LATEST_SCHEMA_VERSION;
  }

  /**
   *
   * @param {Array<Object>} original
   * @param {Array<Object>} updated
   */
  diffCollection(original, updated) {
    const returnData = {
      inserted: [],
      deleted: [],
      updated: []
    };

    const originalSources = new Map();
    original.forEach((source) => originalSources.set(source._id, source));

    updated.forEach((source) => {
      const originalSource = originalSources.get(source._id);
      if (originalSource) {
        if (JSON.stringify(originalSource) !== JSON.stringify(source)) {
          returnData.updated.push(source);
        }
        originalSources.delete(source._id);
      } else {
        returnData.inserted.push(source);
      }
    });

    originalSources.forEach((source) => returnData.deleted.push(source._id));

    return returnData;
  }

  /**
   *
   * @param {Object} actor
   * @param {Array<MigrationBase>} migrations
   * @returns {Object}
   */
  async getUpdatedActor(actor, migrations) {
    const actorData = foundry.utils.deepClone(actor);

    for (const migration of migrations) {
      try {
        await migration?.updateActor?.(actorData);

        for (const currentItem of actorData.items) {
          try {
            await migration?.preUpdateItem?.(currentItem, actorData);
            await migration?.updateItem?.(currentItem, actorData);
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    if ('game' in globalThis) {
      const latestMigration = migrations.slice(-1)[0];
      actorData.system.schema ??= { version: null, lastMigration: null };
      this.#updateSchemaRecord(actorData.system.schema, latestMigration);

      for (const itemData of actorData.items) {
        itemData.system.schema ??= { version: null, lastMigration: null };
        this.#updateSchemaRecord(itemData.system.schema, latestMigration);
      }
    }

    return actorData;
  }

  /**
   *
   * @param {Object} item
   * @param {Array<MigrationBase>} migrations
   * @returns {Object}
   */
  async getUpdatedItem(item, migrations) {
    const itemData = foundry.utils.deepClone(item);

    try {
      for (const migration of migrations) {
        await migration?.preUpdateItem?.(itemData);
        await migration?.updateItem?.(itemData);
      }
    } catch (e) {
      console.error(e);
    }

    if (migrations.length > 0) {
      this.#updateSchemaRecord(itemData.system.schema, migrations.slice(-1)[0]);
    }
    return itemData;
  }

  /**
   *
   * @param {Object} macro
   * @param {Array<MigrationBase>} migrations
   * @returns {Object}
   */
  async getUpdatedMacro(macro, migrations) {
    const macroData = foundry.utils.deepClone(macro);

    for (const migration of migrations) {
      try {
        await migration?.updateMacro?.(macroData);
      } catch (e) {
        console.error(e);
      }
    }

    return macroData;
  }

  /**
   * @param {Object} journal
   * @param {Array<MigrationBase>} migrations
   * @returns {Object}
   */
  async getUpdatedJournalEntry(journal, migrations) {
    const clone = deepClone(journal);

    for (const migration of migrations) {
      try {
        await migration.updateJournalEntry?.(clone);
      } catch (e) {
        console.error(e);
      }
    }

    return clone;
  }

  /**
   *
   * @param {Object} token
   * @param {Array<MigrationBase>} migrations
   * @returns {Object}
   */
  async getUpdatedToken(token, migrations) {
    const tokenData = token.toObject();
    for (const migration of migrations) {
      try {
        await migration?.updateToken?.(tokenData, token.actor, token.scene);
      } catch (e) {
        console.error(e);
      }
    }

    return tokenData;
  }

  /**
   *
   * @param {*} user
   * @param {Array<MigrationBase>} migrations
   * @returns {Object}
   */
  async getUpdatesUser(user, migrations) {
    const userData = foundry.utils.deepClone(user);

    for (const migration of migrations) {
      try {
        await migration?.updateUser?.(userData);
      } catch (e) {
        console.error(e);
      }
    }

    return userData;
  }

  /**
   *
   * @param {Object} schema
   * @param {MigrationBase} latestMigration
   */
  #updateSchemaRecord(schema, latestMigration) {
    if (!('game' in globalThis && latestMigration)) return;

    const fromVersion = typeof schema.version === 'number' ? schema.version : null;
    schema.version = latestMigration.version;
    schema.lastMigration = {
      version: {
        schema: fromVersion,
        foundry: game.version,
        system: game.system.version
      }
    };
  }
}
