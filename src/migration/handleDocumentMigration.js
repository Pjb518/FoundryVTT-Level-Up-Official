import MigrationList from './MigrationList';
import MigrationRunner from './MigrationRunner';

export default async function handleDocumentMigration(document) {
  if (!game.user.isGM) return;

  const legacyVersion = game.settings.get('a5e', 'systemMigrationVersion');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const legacyMigrate = foundry.utils.isNewerVersion('0.10.8', legacyVersion); // TODO: Migration - Fix where the goes

  const migrationRunner = new MigrationRunner(
    MigrationList.constructFromVersion(
      document.system.schemaVersion?.version ?? document.system.schema.version ?? 0.000
    )
  );

  const result = await migrationRunner.runDocumentMigration(
    document,
    migrationRunner.migrations
  );

  if (result) {
    ui.notifications.info(`Migrated ${document.name} to the latest version.`);
  } else {
    ui.notifications.info(`No migration for ${document.name} not available.`);
  }
}
