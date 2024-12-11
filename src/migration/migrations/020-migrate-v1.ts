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

		// Migrate Action Data
		source.system.actions = this.#migrateActionData(source);
	}

	override async updateEffect(source: any, parent?: any): Promise<void> {
		// Migrate applyToSelf
		source.system.applyToSelf = source.flags?.a5e?.applyToSelf ?? false;

		// Migrate transferType to effect type
		source.system.effectType = source.flags?.a5e?.transferType ?? 'passive';

		source['flags.a5e.-=actionId'] = null;
		source['flags.a5e.-=applyToSelf'] = null;
		source['flags.a5e.-=transferType'] = null;
	}

	#migrateActionData(source: Record<string, any>) {
		const actions = Object.entries(source.system.actions ?? {});

		return actions.reduce((acc, [actionId, action]: [string, any]) => {
			const data = foundry.utils.deepClone(action);

			const prompts = Object.entries(action.prompts ?? {});
			data.prompts = prompts.reduce((acc, [promptId, prompt]: [string, any]) => {
				if (prompt.type !== 'effect') {
					acc[promptId] = prompt;
					return acc;
				}

				// Migrate action effects
				const effectId: string = prompt.effectId || '';
				if (!effectId) return acc;

				data.effects ??= [];
				data.effects.push(effectId);
				acc[`-=${promptId}`] = null;

				return acc;
			}, {});

			acc[actionId] = data;
			return acc;
		}, {});
	}

	#migrateSchemaData(source: Record<string, any>) {
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
