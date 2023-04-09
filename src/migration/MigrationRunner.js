/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
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
}
