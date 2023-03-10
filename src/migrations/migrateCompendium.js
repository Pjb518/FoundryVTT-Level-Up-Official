/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */

import migrateActorData from './migrateActorData';
import migrateItemData from './migrateItemData';
import migrateSceneData from './migrateSceneData';

/**
 * Apply migration rules to all Documents within a single Compendium pack
 * @param {CompendiumCollection} pack  Pack to be migrated.
 * @returns {Promise}
 */
export default async function migrateCompendium(pack) {
  const { documentName } = pack;

  if (!['Actor', 'Item', 'Scene'].includes(documentName)) return;

  // Unlock the pack for editing
  const wasLocked = pack.locked;
  await pack.configure({ locked: false });

  // Begin by requesting server-side data model migration and get the migrated content
  await pack.migrate();
  const documents = await pack.getDocuments();

  // Iterate over compendium entries - applying fine-tuned migration functions
  for (const doc of documents) {
    const updateData = {};

    try {
      if (documentName === 'Actor') migrateActorData(doc.toObject());
      else if (documentName === 'Item') migrateItemData(doc.toObject());
      else if (documentName === 'Scene') migrateSceneData(doc.toObject());

      // Save the entry, if data was changed
      if (foundry.utils.isEmpty(updateData)) continue;
      await doc.update(updateData);

      console.info(`Migrated ${documentName} document ${doc.name} in Compendium ${pack.collection}`);
    } catch (err) {
      err.message = `Failed Level Up system migration for document ${doc.name} in pack ${pack.collection}: ${err.message}`;
      console.error(err);
    }
  }

  // Apply the original locked status for the pack
  await pack.configure({ locked: wasLocked });

  console.info(`Migrated all ${documentName} documents from Compendium ${pack.collection}`);
}
