import MigrationList from './MigrationList';
import MigrationRunner from './MigrationRunner';

export default async function handleMigration() {
  if (!game.user.isGM) return;

  // Determine whether a system migration is required
  const legacyVersion = game.settings.get('a5e', 'systemMigrationVersion');
  const legacyMigrate = foundry.utils.isNewerVersion('0.10.8', legacyVersion);
  const currentVersion = legacyMigrate ? '0.000' : game.settings.get('a5e', 'worldSchemaVersion');

  // Save the current world schema version if hasn't before.
  const storedSchemaVersion = game.settings.storage
    .get('world')
    .getItem('a5e.worldSchemaVersion');

  if (!storedSchemaVersion) {
    const minimumVersion = MigrationRunner.RECOMMENDED_SAFE_VERSION;
    const currVersion = game.actors.size === 0
      ? game.settings.get('a5e', 'worldSchemaVersion')
      : Math.max(
        Math.min(...new Set(game.actors.map((actor) => actor.schemaVersion ?? minimumVersion))),
        minimumVersion
      );

    await game.settings.set('a5e', 'worldSchemaVersion', currVersion);
  }

  // Perform Migrations if necessary
  const migrationList = MigrationList.constructFromVersion(currentVersion);
  // eslint-disable-next-line no-console
  console.debug('A5E | Migration List', migrationList);
  const migrationRunner = new MigrationRunner(migrationList);

  if (migrationRunner.needsMigration()) {
    if (currentVersion && currentVersion < MigrationRunner.MIN_SAFE_VERSION) {
      ui.notifications.error(
        'Your A5E system data is from too old a Foundry version and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.',
        { permanent: true }
      );
    }

    await migrationRunner.runMigration();
    // TODO: Add Migration summary
    // https://github.com/foundryvtt/pf2e/blob/5fd278acdd15f5337e54484bde45b2e1f5bf0b0a/src/module/apps/migration-summary.ts
  }
}
