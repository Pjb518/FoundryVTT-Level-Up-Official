import { createInitialGrant } from '#utils/createInitialGrant.ts';

import { A5EBaseItemData } from './base.ts';
import { GrantsField } from './Grants/GrantsField.ts';

import fields = foundry.data.fields;

const schema = () => ({
	slug: new fields.StringField({ nullable: false, initial: '' }),
	archetypeLevel: new fields.NumberField({
		required: true,
		nullable: false,
		initial: 3,
		min: 0,
		max: 20,
	}),
	classLevels: new fields.NumberField({
		required: true,
		nullable: false,
		initial: 0,
		min: 0,
		max: 20,
	}),
	maxLevel: new fields.NumberField({
		required: true,
		nullable: false,
		initial: 20,
		min: 0,
		max: 20,
	}),
	hp: new fields.SchemaField({
		hitDiceSize: new fields.NumberField({
			required: true,
			nullable: false,
			initial: 6,
			min: 4,
			max: 20,
		}),
		hitDiceUsed: new fields.NumberField({
			required: true,
			nullable: false,
			initial: 0,
			min: 0,
		}),
		levels: new fields.SchemaField(
			Array.from({ length: 20 }, (_, i) => i + 1).reduce((acc, level) => {
				acc[level] = new fields.NumberField({
					required: true,
					nullable: false,
					initial: 0,
					min: 0,
				});
				return acc;
			}, {}),
		),
	}),
	grants: new GrantsField({
		nullable: false,
		initial: () => ({
			...createInitialGrant('proficiency', {
				config: {
					keys: {
						base: [],
						options: [],
						total: 0,
					},
				},
				name: 'Armor Proficiencies',
				levelType: 'class',
			}),
			...createInitialGrant('proficiency', {
				config: {
					keys: {
						base: [],
						options: [],
						total: 0,
					},
				},
				name: 'Weapon Proficiencies',
				levelType: 'class',
			}),
			...createInitialGrant('proficiency', {
				config: {
					keys: {
						base: [],
						options: [],
						total: 0,
					},
				},
				name: 'Tool Proficiencies',
				levelType: 'character',
			}),
			...createInitialGrant('proficiency', {
				config: {
					keys: {
						base: [],
						options: [],
						total: 0,
					},
					isExpertise: false,
				},
				name: 'Saving Throw Proficiencies',
				levelType: 'character',
			}),
			...createInitialGrant('proficiency', {
				config: {
					keys: {
						base: [],
						options: [],
						total: 0,
					},
					isExpertise: false,
				},
				name: 'Skill Proficiencies',
				levelType: 'character',
			}),
			...createInitialGrant('feature', {
				config: {
					features: {
						base: [],
						options: [],
						total: 0,
					},
				},
				name: '1st Level Class Features',
				levelType: 'class',
			}),
			...createInitialGrant('item', {
				config: {
					items: {
						base: [],
						options: [],
						total: 0,
					},
				},
				name: 'Starting Equipment',
				levelType: 'character',
				optional: true,
			}),
		}),
	}),
	resources: new fields.ArrayField(
		new fields.SchemaField({
			name: new fields.StringField({ nullable: false, required: true, initial: 'New Resource' }),
			consumable: new fields.BooleanField({ nullable: false, required: true, initial: false }),
			displayOnCore: new fields.BooleanField({ nullable: false, required: true, initial: true }),
			reference: new fields.SchemaField(
				Array.from({ length: 20 }, (_, i) => i + 1).reduce((acc, level) => {
					acc[level] = new fields.StringField({ required: true, initial: '' });
					return acc;
				}, {}),
			),
			recovery: new fields.StringField({ nullable: false, required: true, initial: 'longRest' }),
			slug: new fields.StringField({ nullable: false, required: true, initial: '' }),
		}),
		{ nullable: false, required: true, initial: [] },
	),
	spellcasting: new fields.SchemaField({
		ability: new fields.SchemaField({
			base: new fields.StringField({ nullable: false, initial: 'none' }),
			options: new fields.ArrayField(new fields.StringField({ nullable: false, initial: 'none' }), {
				nullable: false,
				initial: [],
			}),
			value: new fields.StringField({ nullable: false, initial: 'none' }),
		}),
		casterType: new fields.StringField({ nullable: false, initial: 'none' }),
		maxPreparedFormula: new fields.StringField({ required: true, nullable: false, initial: '0' }),
	}),
	wealth: new fields.StringField({ nullable: false, initial: '' }),
});

declare namespace A5EClassData {
	type Schema = A5EBaseItemData.Schema & ReturnType<typeof schema>;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EClassData extends A5EBaseItemData<
	A5EClassData.Schema,
	A5EClassData.BaseData,
	A5EClassData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5EClassData.Schema {
		return {
			...super.defineSchema(),
			...schema(),
		};
	}
}

export { A5EClassData };
