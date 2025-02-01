import { A5EBaseItemData } from './base';

const { fields } = foundry.data;

const schema = {
	slug: new fields.StringField({ nullable: false, initial: '' }),
	class: new fields.StringField({ nullable: false, initial: '' }),
	grants: new fields.ObjectField({ nullable: false }),
	resources: new fields.ArrayField(
		new fields.SchemaField({
			name: new fields.StringField({ nullable: false, initial: 'New Resource' }),
			consumable: new fields.BooleanField({ nullable: false, required: true, initial: false }),
			displayOnCore: new fields.BooleanField({ nullable: false, required: true, initial: true }),
			reference: new fields.SchemaField(
				Array.from({ length: 20 }, (_, i) => i + 1).reduce((acc, level) => {
					acc[level] = new fields.StringField({ required: true, initial: '' });
					return acc;
				}, {}),
			),
			recovery: new fields.StringField({ nullable: false, initial: 'longRest' }),
			slug: new fields.StringField({ nullable: false, initial: '' }),
		}),
		{ nullable: false, initial: [] },
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
};

declare namespace A5EArchetypeData {
	type Schema = A5EBaseItemData.Schema & typeof schema;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EArchetypeData extends A5EBaseItemData<
	A5EArchetypeData.Schema,
	A5EArchetypeData.BaseData,
	A5EArchetypeData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5EArchetypeData.Schema {
		return {
			...super.defineSchema(),
			...schema,
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5EArchetypeData };
