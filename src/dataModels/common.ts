import { MigrationRunner } from '../migration/MigrationRunner';

const { fields } = foundry.data;

// eslint-disable-next-line import/prefer-default-export
export const migrationData = () => ({
	migrationData: new fields.SchemaField({
		version: new fields.NumberField({
			required: true,
			nullable: true,
			initial: MigrationRunner.LATEST_SCHEMA_VERSION,
		}),
		type: new fields.StringField({ required: true, nullable: false, initial: '' }),
		lastMigration: new fields.SchemaField({
			schema: new fields.NumberField({ nullable: true }),
			system: new fields.StringField({ nullable: true, required: false }),
			foundry: new fields.StringField({ nullable: true, required: false }),
		}),
	}),
});

export type SchemaData = ReturnType<typeof migrationData>;

// -----------------------------------------
// Source
// -----------------------------------------
export const source = () => ({
	source: new fields.StringField({ required: true, initial: '' }),
});

export type Source = ReturnType<typeof source>;
