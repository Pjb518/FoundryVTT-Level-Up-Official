import MigrationList from './MigrationList';
import MigrationRunner from './MigrationRunner';

export default async function handlePackMigration(pack, fullMigration = false) {
  if (!game.user.isGM) return;

  ui.notifications.info(`Migrating ${pack.metadata.label} to the latest version.`, { permanent: true });

  const migrationRunner = new MigrationRunner(
    MigrationList.constructFromVersion(null)
  );

  console.log(migrationRunner);
  await migrationRunner.runCompendiumMigration(pack, fullMigration);

  ui.notifications.info(`Migrated ${pack.metadata.label} to the latest version.`, { permanent: true });
}
