import { MigrationList } from './MigrationList';
import { MigrationRunnerFoundry } from './runner/foundryRunner';

export default async function handlePackMigration(pack, fullMigration = false) {
	if (!game.user!.isGM) return;

	ui.notifications.info(`Migrating ${pack.metadata.label} to the latest version.`, {
		permanent: true,
	});

	const migrationRunner = new MigrationRunnerFoundry(MigrationList.constructFromVersion());

	// TODO: Fix this
	await migrationRunner.runCompendiumMigration(pack, fullMigration);

	ui.notifications.info(`Migrated ${pack.metadata.label} to the latest version.`, {
		permanent: true,
	});
}
