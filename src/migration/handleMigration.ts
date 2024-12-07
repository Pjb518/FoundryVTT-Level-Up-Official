import { MigrationList } from './MigrationList';
import { MigrationRunnerFoundry } from './runner/foundryRunner';

export default async function handleMigration() {
	if (!game.user!.isGM) return;

	// Determine whether a system migration is required
	let currentVersion = game.settings.get('a5e', 'worldSchemaVersion') as number;

	// Save the current world schema version if hasn't before.
	const storedSchemaVersion = game.settings.storage.get('world')!.getItem('a5e.worldSchemaVersion');

	if (!storedSchemaVersion) {
		const minimumVersion = MigrationRunnerFoundry.RECOMMENDED_SAFE_VERSION;
		currentVersion =
			game.actors.size === 0
				? (game.settings.get('a5e', 'worldSchemaVersion') as number)
				: Math.max(
						Math.min(
							// @ts-expect-error
							...new Set(
								game.actors.map((actor) => (actor.schemaVersion as number) ?? minimumVersion),
							),
						),
						minimumVersion,
					);

		await game.settings.set('a5e', 'worldSchemaVersion', currentVersion);
	}

	// Perform Migrations if necessary
	const migrationList = MigrationList.constructFromVersion(currentVersion);
	console.debug('A5E | Migration List', migrationList);
	const migrationRunner = new MigrationRunnerFoundry(migrationList);

	if (migrationRunner.needsMigration()) {
		if (currentVersion && currentVersion < MigrationRunnerFoundry.MINIMUM_SAFE_VERSION) {
			ui.notifications.error(
				'Your A5E system data is from too old a Foundry version and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.',
				{ permanent: true },
			);
		}

		await migrationRunner.runMigration();
	}
}
