import MigrationList from './MigrationList';
import MigrationRunner from './MigrationRunner';

export default async function handlePackMigration(pack, fullMigration = false) {
  if (!game.user.isGM) return;

  const legacyVersion = game.settings.get('a5e', 'systemMigrationVersion');
  const legacyMigrate = foundry.utils.isNewerVersion('0.10.8', legacyVersion);
  const currentVersion = legacyMigrate ? '0.000' : game.settings.get('a5e', 'worldSchemaVersion');

  const migrationRunner = new MigrationRunner(
    MigrationList.constructFromVersion(currentVersion)
  );

  await migrationRunner.runCompendiumMigration(pack, fullMigration);

  ui.notifications.info(`Migrated ${pack.metadata.label} to the latest version.`, { permanent: true });
}
