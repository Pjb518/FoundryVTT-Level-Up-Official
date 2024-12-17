import { MigrationList } from '../MigrationList';
import { MigrationRunnerFoundry } from '../runner/foundryRunner';

export async function handlePackMigration(pack, fullMigration = false) {
	if (!game.user!.isGM) return;

	ui.notifications.info(`Migrating ${pack.metadata.label} to the latest version.`, {
		permanent: true,
	});

	await pack.getDocuments();
	const minimumVersion = pack.contents.reduce((acc, curr) => {
		const minSafeVer = MigrationRunnerFoundry.MINIMUM_SAFE_VERSION;
		const currVer =
			curr.system?.migrationData?.version ?? curr.system?.schemaVersion?.version ?? minSafeVer;

		const res = Math.min(acc, currVer);
		return Math.max(res, minSafeVer);
	}, MigrationRunnerFoundry.LATEST_MIGRATION_VERSION);

	console.log(`Migrating from a minimum Version of ${minimumVersion}.`);

	const migrationList = fullMigration
		? MigrationList.constructFromVersion(MigrationRunnerFoundry.RECOMMENDED_SAFE_VERSION)
		: MigrationList.constructFromVersion(minimumVersion);

	const migrationRunner = new MigrationRunnerFoundry(migrationList);

	await migrationRunner.runCompendiumMigration(migrationRunner.migrations, pack);

	ui.notifications.info(`Migrated ${pack.metadata.label} to the latest version.`, {
		permanent: true,
	});
}
