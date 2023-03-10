/**
 * Migrate a single Actor document to incorporate latest data model changes
 * Return an Object of updateData to be applied
 * @param {object} actor            The actor data object to update
 * @param {object} [migrationData]  Additional data to perform the migration
 * @returns {object}                The updateData to apply
 */
export default function migrateActorData(actor) {
  const updateData = {};

  // Actor data updates
  if (actor.system) {
  }

  return updateData;
}
