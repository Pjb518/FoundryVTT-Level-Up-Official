import { MigrationList } from '../MigrationList';
import { MigrationRunnerFoundry } from '../runner/foundryRunner';

// export default async function handleDocumentMigration(document) {
// 	if (!game.user!.isGM) return;

// 	const legacyVersion = game.settings.get('a5e', 'systemMigrationVersion') as number;
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	const legacyMigrate = foundry.utils.isNewerVersion('0.10.8', legacyVersion); // TODO: Migration - Fix where the goes

// 	const migrationRunner = new MigrationRunnerFoundry(
// 		MigrationList.constructFromVersion(document.system.migrationData?.version ?? 0.0),
// 	);

// 	const result = await migrationRunner.runDocumentMigration(document, migrationRunner.migrations);

// 	if (result) {
// 		ui.notifications.info(`Migrated ${document.name} to the latest version.`);
// 	} else {
// 		ui.notifications.info(`No migration for ${document.name} not available.`);
// 	}
// }

export async function handleDocumentMigration(document) {
	if (!game.user?.isGM) return false;

	const currentVersion = document.system.migrationData.version ?? 0;

	const migrationRunner = new MigrationRunnerFoundry(
		MigrationList.constructFromVersion(currentVersion),
	);

	// TODO: Run Migration
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
