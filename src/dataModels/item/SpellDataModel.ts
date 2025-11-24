import type { ActionsData, UsesData } from './common';

import { A5EBaseItemData } from './base';
import { actions, uses } from './common';

const { fields } = foundry.data;

const schema = {
	classes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		required: true,
		initial: [],
	}),
	components: new fields.SchemaField({
		vocalized: new fields.BooleanField({ required: true, initial: false }),
		seen: new fields.BooleanField({ required: true, initial: false }),
		material: new fields.BooleanField({ required: true, initial: false }),
	}),
	concentration: new fields.BooleanField({ required: true, initial: false }),
	disciplines: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			required: true,
			initial: [],
		}),
	level: new fields.NumberField({
		required: true,
		nullable: false,
		initial: 0,
		integer: true,
		min: 0,
	}),
	materials: new fields.StringField({ required: true, initial: '' }),
	materialsConsumed: new fields.BooleanField({ required: true, initial: false }),
	prepared: new fields.NumberField({ required: true, initial: 0 }),
	prerequisite: new fields.StringField({ required: true, initial: '' }),
	rare: new fields.BooleanField({ required: true, initial: false }),
	ritual: new fields.BooleanField({ required: true, initial: false }),
	schools: new fields.SchemaField({
		primary: new fields.StringField({ required: true, initial: '' }),
		secondary: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			required: true,
			initial: [],
		}),
	}),
	spellBook: new fields.StringField({ required: true, initial: '', nullable: false }),
};

declare namespace A5ESpellData {
	type Schema = A5EBaseItemData.Schema & ActionsData & UsesData & typeof schema;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5ESpellData extends A5EBaseItemData<
	A5ESpellData.Schema,
	A5ESpellData.BaseData,
	A5ESpellData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5ESpellData.Schema {
		return {
			...super.defineSchema(),
			...actions(),
			...uses(),
			...schema,
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5ESpellData };
