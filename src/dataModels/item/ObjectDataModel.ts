import { A5EBaseItemData } from './base.ts';
import type { ActionsData, ArmorData, UsesData } from './common.ts';
import { actions, armor, uses } from './common.ts';

import fields = foundry.data.fields;

const schema = {
	ammunitionDamageMode: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'bonus',
		choices: ['bonus', 'override'],
	}),
	ammunitionProperties: new fields.ArrayField(
		new fields.StringField({ required: true, initial: '' }),
		{ required: true, initial: [] },
	),
	armorCategory: new fields.StringField({ required: true, initial: '' }),
	armorMods: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		required: true,
		initial: [],
	}),
	armorProperties: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		required: true,
		initial: [],
	}),
	attuned: new fields.BooleanField({ required: true, initial: false }),
	attunementHint: new fields.StringField({ required: true, initial: '' }),
	bulky: new fields.BooleanField({ required: true, initial: false }),
	breakerProperties: new fields.ArrayField(
		new fields.StringField({ required: true, initial: '' }),
		{ required: true, initial: [] },
	),
	capacity: new fields.SchemaField({
		type: new fields.StringField({ required: true, initial: 'weight' }),
		value: new fields.NumberField({ nullable: false, initial: 0, min: 0 }),
		weightlessContents: new fields.BooleanField({ required: true, initial: false }),
	}),
	containerId: new fields.StringField({ required: true, initial: '' }),
	containerSortDirection: new fields.StringField({ required: true, initial: 'ascending' }),
	containerSortMethod: new fields.StringField({ required: true, initial: 'none' }),
	craftingComponents: new fields.StringField({ required: true, initial: '' }),
	damagedState: new fields.NumberField({
		required: true,
		initial: 0,
		integer: true,
		min: 0,
		max: 2,
	}),
	defensiveProperties: new fields.StringField({ required: true, initial: '' }),
	endemicLifeProperties: new fields.SchemaField({
		biomes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			required: true,
			initial: [],
		}),
		creatureType: new fields.StringField({ nullable: false, initial: '' }),
		properties: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			required: true,
			initial: [],
		}),
		regions: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			required: true,
			initial: [],
		}),
		size: new fields.StringField({ nullable: false, initial: '' }),
		type: new fields.StringField({ nullable: false, initial: '' }),
	}),
	energyProperties: new fields.StringField({ required: true, initial: '' }),
	equippedState: new fields.NumberField({
		required: true,
		initial: 0,
		integer: true,
		min: 0,
		max: 2,
	}),
	flaws: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		required: true,
		initial: [],
	}),
	items: new fields.ObjectField({ required: true, initial: {} }),
	implant: new fields.BooleanField({ required: true, initial: false }),
	materialProperties: new fields.ArrayField(
		new fields.StringField({ required: true, initial: '' }),
		{ required: true, initial: [] },
	),
	modPorts: new fields.StringField({ required: true, initial: '' }),
	mounted: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		required: true,
		initial: [],
	}),
	objectType: new fields.StringField({ required: true, initial: '' }),
	plotItem: new fields.BooleanField({ required: true, initial: false }),
	// price: new fields.StringField({ required: true, initial: '' }),
	price: new fields.SchemaField(
		{
			value: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
			denomination: new fields.StringField({ required: true, nullable: false, initial: 'gp' }),
			special: new fields.StringField({ required: true, nullable: false, initial: '' }),
		},
		{ required: true, nullable: false },
	),
	proficient: new fields.BooleanField({ required: true, initial: false }),
	quantity: new fields.NumberField({
		required: true,
		nullable: false,
		initial: 1,
		integer: true,
		min: 0,
	}),
	rarity: new fields.StringField({ required: true, initial: 'mundane' }),
	repairabilityDC: new fields.NumberField({
		required: true,
		initial: 0,
		min: 0,
		nullable: false,
	}),
	repairTools: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		required: true,
		initial: [],
	}),
	requiresAttunement: new fields.BooleanField({ required: true, initial: false }),
	shieldCategory: new fields.StringField({ required: true, initial: '' }),
	shieldProperties: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		required: true,
		initial: [],
	}),
	supply: new fields.BooleanField({ required: true, initial: false }),
	techLevel: new fields.StringField({ required: true, initial: 'archaic' }),
	unidentified: new fields.BooleanField({ required: true, initial: false }),
	unidentifiedDescription: new fields.HTMLField({ required: true, initial: '' }),
	unidentifiedName: new fields.StringField({ required: true, initial: '' }),
	versatile: new fields.StringField({ required: true, initial: '' }),
	weaponAugments: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		required: true,
		initial: [],
	}),
	weaponProperties: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		required: true,
		initial: [],
	}),
	weight: new fields.NumberField({
		required: true,
		initial: 0,
		min: 0,
		nullable: false,
	}),
};

declare namespace A5EObjectData {
	type Schema = A5EBaseItemData.Schema & ActionsData & ArmorData & UsesData & typeof schema;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EObjectData extends A5EBaseItemData<
	A5EObjectData.Schema,
	A5EObjectData.BaseData,
	A5EObjectData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5EObjectData.Schema {
		return {
			...super.defineSchema(),
			...actions(),
			...armor(),
			...uses(),
			...schema,
		};
	}

	// static override migrateData(source: object, options): object {
	// 	if (typeof source.price === 'string') this.#migratePrice(source);

	// 	return super.migrateData(source, options);
	// }

	// static #migratePrice(source) {
	// 	const original = source.price;
	// 	const trimmed = original.trim();

	// 	let amount: number = 0;
	// 	let denomination = 'gp';
	// 	let special = '';

	// 	// number + optional space + 2-character denomination
	// 	const match = trimmed.match(/^((?:\d{1,3}(?:,\d{3})+)|\d+)\s*([A-Za-z]{2})$/);

	// 	if (match) {
	// 		amount = Number(match[1].replace(/,/g, ''));
	// 		denomination = match[2];
	// 	} else {
	// 		special = trimmed;
	// 	}

	// 	source.price = { value: amount, denomination, special };
	// }
}

// eslint-disable-next-line import/prefer-default-export
export { A5EObjectData };
