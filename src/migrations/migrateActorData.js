import { actorMigrators } from './v090/migratev090';

/**
 * Migrate a single Actor document to incorporate latest data model changes
 * Return an Object of updateData to be applied
 * @param {object} actor            The actor data object to update
 * @param {object} [migrationData]  Additional data to perform the migration
 * @returns {object}                The updateData to apply
 */
export default function migrateActorData(actor) {
  const updateData = {};

  // TODO: Remove in V0.10.0
  if (foundry.utils.isNewerVersion(game.settings.get('a5e', 'systemMigrationVersion'), '0.9.0')) {
    return {};
  }

  // Actor data updates
  if (actor.system) {
    actorMigrators.forEach((func) => func(actor, updateData));
  }

  return updateData;
}
