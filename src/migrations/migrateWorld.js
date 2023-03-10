/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */

import migrateActorData from './migrateActorData';
import migrateCompendium from './migrateCompendium';
import migrateItemData from './migrateItemData';
import migrateMacroData from './migrateMacroData';
import migrateSceneData from './migrateSceneData';

/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and
 * Compendium packs
 *
 * @returns {Promise}  A Promise which resolves once the migration is completed.
 */
export default async function migrateWorld() {
  ui.notifications.info(`Applying Level Up system migration for version ${game.system.version}. Please be patient and do not close your game or shut down your server.`, { permanent: true });

  // Migrate World Actors
  for (const actor of game.actors) {
    try {
      const actorUpdateData = migrateActorData(actor.toObject());
      const embeddedDocumentUpdateData = actor.items.reduce((itemUpdates, item) => {
        const itemMigrationData = migrateItemData(item.toObject());

        if (!foundry.utils.isEmpty(itemMigrationData)) {
          itemMigrationData._id = item.id;
          itemUpdates.push(itemMigrationData);
        }

        return itemUpdates;
      }, []);

      const updateOperations = [];

      if (!foundry.utils.isEmpty(actorUpdateData)) {
        console.info(`Migrating Actor document ${actor.name}`);
        updateOperations.push(() => (actor.update(actorUpdateData, { enforceTypes: false })));
      }

      if (embeddedDocumentUpdateData.length) {
        console.info(`Migrating embedded items for Actor ${actor.name}`);
        updateOperations.push(() => (actor.updateEmbeddedDocuments('Item', embeddedDocumentUpdateData)));
      }

      await Promise.all(updateOperations.map((operation) => operation()));
    } catch (err) {
      err.message = `Failed Level Up system migration for Actor ${actor.name}: ${err.message}`;
      console.error(err);
    }
  }

  // Migrate World Items
  for (const item of game.items) {
    try {
      const updateData = migrateItemData(item.toObject());
      if (!foundry.utils.isEmpty(updateData)) {
        console.info(`Migrating Item document ${item.name}`);
        await item.update(updateData, { enforceTypes: false });
      }
    } catch (err) {
      err.message = `Failed Level Up system migration for Item ${item.name}: ${err.message}`;
      console.error(err);
    }
  }

  // Migrate World Macros
  for (const macro of game.macros) {
    try {
      const updateData = migrateMacroData(macro.toObject());
      if (!foundry.utils.isEmpty(updateData)) {
        console.info(`Migrating Macro document ${macro.name}`);
        await macro.update(updateData, { enforceTypes: false });
      }
    } catch (err) {
      err.message = `Failed Level Up system migration for Macro ${macro.name}: ${err.message}`;
      console.error(err);
    }
  }

  // Migrate Actor Override Tokens
  for (const scene of game.scenes) {
    try {
      const updateData = migrateSceneData(scene);
      if (!foundry.utils.isEmpty(updateData)) {
        console.info(`Migrating Scene document ${scene.name}`);
        await scene.update(updateData, { enforceTypes: false });

        // If we do not do this, then synthetic token actors remain in cache
        // with the un-updated actorData.
        scene.tokens.forEach((token) => { token._actor = null; });
      }
    } catch (err) {
      err.message = `Failed Level Up system migration for Scene ${scene.name}: ${err.message}`;
      console.error(err);
    }
  }

  // Migrate World Compendium Packs
  for (const pack of game.packs) {
    if (pack.metadata.package !== 'world') continue;
    if (!['Actor', 'Item', 'Scene'].includes(pack.documentName)) continue;

    await migrateCompendium(pack);
  }

  // Set the migration as complete
  game.settings.set('a5e', 'systemMigrationVersion', game.system.data.version);
  ui.notifications.info(`Level Up system migration to version ${game.system.data.version} completed!`, { permanent: true });
}
