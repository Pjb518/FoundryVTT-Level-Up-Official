import MigrationList from './MigrationList';
import MigrationRunner from './MigrationRunner';

export default async function handleDocumentMigration(document) {
  if (!game.user.isGM) return;

  const legacyVersion = game.settings.get('a5e', 'systemMigrationVersion');
  const legacyMigrate = foundry.utils.isNewerVersion('0.10.8', legacyVersion);
  const currentVersion = legacyMigrate ? '0.000' : game.settings.get('a5e', 'worldSchemaVersion');

  const migrationRunner = new MigrationRunner(
    MigrationList.constructFromVersion(
      document.system.schemaVersion.version ?? document.system.schema.version ?? 0.000
    )
  );

  await migrationRunner.runDocumentMigration(
    document,
    migrationRunner.migrations
  );

  ui.notifications.info(`Migrated ${document.name} to the latest version.`);
}
