import { MigrationList } from '../MigrationList';
import { MigrationRunnerFoundry } from '../runner/foundryRunner';

export async function handleDocumentMigration(source) {
	if (!game.user?.isGM) return false;

	const currentVersion =
		source.system.migrationData.version ?? MigrationRunnerFoundry.RECOMMENDED_SAFE_VERSION;

	const migrationRunner = new MigrationRunnerFoundry(
		MigrationList.constructFromVersion(currentVersion),
	);

	const result = await migrationRunner.runDocumentMigration(source);

	if (result) {
		ui.notifications.info(`Migrated ${source.name} to the latest version.`);
	} else {
		ui.notifications.info(`No migration for ${source.name} not available.`);
	}
}

export async function handleDocumentImportMigration(document, forcedVersion: number | null = null) {
	const type = document.documentName;
	const latestVer = MigrationRunnerFoundry.LATEST_MIGRATION_VERSION;
	let version: number;

	if (forcedVersion) version = forcedVersion;
	else if (type === 'Actor') {
		version = Math.min(
			document.system?.migrationData?.version || latestVer,
			...(document.items ?? []).map((i) => i?.system?.migrationData?.version || latestVer),
			// ...(document.effects ?? []).map((e) => e?.system?.migrationData?.version ?? latestVer),
		);
	} else {
		version = document.system.migrationData?.version || latestVer;
	}

	await MigrationRunnerFoundry.ensureSchemaVersion(
		document,
		MigrationList.constructFromVersion(version),
	);
}
