import { RecordField } from '../fields/RecordField';
import { ActionField } from './actions/ActionDataModel';

const { fields } = foundry.data;

// -----------------------------------------
// Actions
// -----------------------------------------

export const actions = () => ({
	// actions: new fields.ObjectField({ required: true, initial: {} })
	actions: new RecordField(
		new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
		new ActionField(),
	),
});

export type ActionsData = ReturnType<typeof actions>;

// -----------------------------------------
// Armor
// -----------------------------------------
export const armor = () => ({
	ac: new fields.SchemaField({
		baseFormula: new fields.StringField({ required: true, initial: '' }),
		formula: new fields.StringField({ required: true, initial: '' }),
		grantsDisadvantage: new fields.BooleanField({ required: true, initial: false }),
		maxDex: new fields.NumberField({ required: true, initial: 0, min: 0 }),
		minStr: new fields.NumberField({ required: true, initial: 0, min: 0 }),
		mode: new fields.NumberField({ required: true, initial: 2 }),
		requiresNoShield: new fields.BooleanField({ required: true, initial: false }),
		requiresUnarmored: new fields.BooleanField({ required: true, initial: false }),
	}),
});

export type ArmorData = ReturnType<typeof armor>;

// -----------------------------------------
// Description
// -----------------------------------------
export const description = () => ({
	description: new fields.HTMLField({ required: true, initial: '' }),
});

export const secretDescription = () => ({
	secretDescription: new fields.HTMLField({ required: true, initial: '' }),
});

export type DescriptionData = ReturnType<typeof description>;
export type SecretDescriptionData = ReturnType<typeof secretDescription>;

// -----------------------------------------
// Favorite
// -----------------------------------------
export const favorite = () => ({
	favorite: new fields.BooleanField({ required: true, initial: false }),
});

export type FavoriteData = ReturnType<typeof favorite>;

// -----------------------------------------
// Source
// -----------------------------------------
export const source = () => ({
	source: new fields.StringField({ required: true, initial: '' }),
});

export type SourceData = ReturnType<typeof source>;

// -----------------------------------------
// Uses
// -----------------------------------------
export const uses = () => ({
	uses: new fields.SchemaField({
		value: new fields.NumberField({
			required: true,
			initial: 0,
			min: 0,
			integer: true,
			nullable: false,
		}),
		max: new fields.StringField({ required: true, initial: '', nullable: false }),
		per: new fields.StringField({ required: true, initial: '' }),
		recharge: new fields.SchemaField({
			formula: new fields.StringField({ required: true, initial: '' }),
			threshold: new fields.NumberField({ required: true, initial: 0, integer: true }),
		}),
	}),
});

export type UsesData = ReturnType<typeof uses>;
