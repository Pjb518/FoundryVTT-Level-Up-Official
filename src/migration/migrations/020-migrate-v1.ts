import { MigrationBase } from '../MigrationBase';

export class Migration020MigrateToV1 extends MigrationBase {
	static override version = 0.02;

	override async updateActor(source: Record<string, any>): Promise<void> {
		// Migrate schema data
		this.#migrateSchemaData(source);
	}

	override async updateItem(source: any): Promise<void> {
		// Migrate schema data
		this.#migrateSchemaData(source);
	}

	#migrateSchemaData(source: Record<string, any>) {
		console.log(foundry.utils.deepClone(source));
		const data = source.system.schemaVersion;
		if (!data || typeof data !== 'object') return;

		const migrationData = {
			version: data.version ?? null,
			lastMigration: {
				schema: data.lastMigration?.version?.schema ?? null,
				system: data.lastMigration?.system?.schema ?? null,
				foundry: data.lastMigration?.version?.system ?? null,
			},
		};

		source.system.migrationData = migrationData;
	}
}
