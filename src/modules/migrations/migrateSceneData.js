import migrateActorData from './migrateActorData';

/**
 * Migrate a single Scene document to incorporate changes to the data model of it's actor data
 * overrides.
 *
 * Return an Object of updateData to be applied
 *
 * @param {object} scene            The Scene data to Update
 * @param {object} [migrationData]  Additional data to perform the migration
 * @returns {object}                The updateData to apply
 */
export default function migrateSceneData(scene) {
  const tokens = scene.tokens.map((token) => {
    const t = token.toObject();
    const update = {};

    if (Object.keys(update).length) foundry.utils.mergeObject(t, update);

    if (!t.actorId || t.actorLink) {
      t.actorData = {};
    } else if (!game.actors.has(t.actorId)) {
      t.actorId = null;
      t.actorData = {};
    } else if (!t.actorLink) {
      const actorData = duplicate(t.actorData);
      actorData.type = token.actor?.type;

      const update = migrateActorData(actorData);

      ['items', 'effects'].forEach((embeddedName) => {
        if (!update[embeddedName]?.length) return;

        const updates = new Map(update[embeddedName].map((u) => [u._id, u]));

        t.actorData[embeddedName].forEach((original) => {
          const update = updates.get(original._id);
          if (update) mergeObject(original, update);
        });

        delete update[embeddedName];
      });

      mergeObject(t.actorData, update);
    }
    return t;
  });

  return { tokens };
}
