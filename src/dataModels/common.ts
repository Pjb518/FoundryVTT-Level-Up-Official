import { RollModeField } from './fields/RollModeField.ts';

const { fields } = foundry.data;

// eslint-disable-next-line import/prefer-default-export
export const migrationData = () => ({
	migrationData: new fields.SchemaField({
		version: new fields.NumberField({
			required: true,
			nullable: true,
			initial: null,
		}),
		type: new fields.StringField({ required: true, nullable: false, initial: '' }),
		lastMigration: new fields.SchemaField({
			schema: new fields.NumberField({ nullable: true }),
			system: new fields.StringField({ nullable: true, required: false }),
			foundry: new fields.StringField({ nullable: true, required: false }),
		}),
	}),
});

export type MigrationData = ReturnType<typeof migrationData>;

// -----------------------------------------
// Roll Modification
// -----------------------------------------
export const d20RollModification = () => ({
	bonus: new fields.StringField({ required: true, nullable: false, initial: '', persisted: false }),
	maxRoll: new fields.NumberField({
		required: true,
		nullable: false,
		initial: 20,
		integer: true,
		min: 1,
		max: 20,
	}),
	minRoll: new fields.NumberField({
		required: true,
		nullable: false,
		initial: 1,
		integer: true,
		min: 1,
		max: 20,
	}),
	rollMode: new RollModeField(),
});

export type D20RollModification = ReturnType<typeof d20RollModification>;

// -----------------------------------------
// Source
// -----------------------------------------
export const source = () => ({
	source: new fields.StringField({ required: true, initial: '' }),
});

export type Source = ReturnType<typeof source>;
