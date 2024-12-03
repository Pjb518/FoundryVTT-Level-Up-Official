import MigrationRunner from '../../migration/MigrationRunner';

// eslint-disable-next-line @typescript-eslint/naming-convention

export type SchemaSchema = {
	schemaVersion: foundry.data.fields.SchemaField<{
		version: foundry.data.fields.NumberField<{ nullable: true; initial: number }>;
		lastMigration: foundry.data.fields.SchemaField<
			{
				version: foundry.data.fields.SchemaField<{
					schema: foundry.data.fields.NumberField<{ nullable: true }>;
					system: foundry.data.fields.StringField<{ nullable: true; required: false }>;
					foundry: foundry.data.fields.StringField<{ nullable: true; required: false }>;
				}>;
			},
			{ nullable: true; initial: null }
		>;
	}>;
};

export default class SchemaDataModel extends foundry.abstract.TypeDataModel<
	SchemaSchema,
	Item.ConfiguredInstance
> {
	static override defineSchema(): SchemaSchema {
		return {
			schemaVersion: new foundry.data.fields.SchemaField({
				version: new foundry.data.fields.NumberField({
					nullable: true,
					initial: MigrationRunner.LATEST_SCHEMA_VERSION,
				}),
				lastMigration: new foundry.data.fields.SchemaField(
					{
						version: new foundry.data.fields.SchemaField({
							schema: new foundry.data.fields.NumberField({ nullable: true }),
							system: new foundry.data.fields.StringField({ nullable: true, required: false }),
							foundry: new foundry.data.fields.StringField({ nullable: true, required: false }),
						}),
					},
					{ nullable: true, initial: null },
				),
			}),
		};
	}
}
