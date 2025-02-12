import { metadata } from './common';

const { fields } = foundry.data;

const rollCardSchema = () => ({
	rollData: new fields.ArrayField(new fields.ObjectField({ required: true, nullable: false })),
	rollType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'abilityCheck',
		choices: ['abilityCheck', 'hitDice', 'initiative', 'savingThrow', 'skillCheck'],
	}),
});

declare namespace A5eRollCardData {
	type Schema = DataSchema & ReturnType<typeof metadata> & ReturnType<typeof rollCardSchema>;
	interface BaseData extends Record<string, unknown> {}
	interface DerivedData extends Record<string, unknown> {}
}

class A5eRollCardData extends foundry.abstract.TypeDataModel<
	A5eRollCardData.Schema,
	ChatMessage.ConfiguredInstance,
	A5eRollCardData.BaseData,
	A5eRollCardData.DerivedData
> {
	static override defineSchema(): A5eRollCardData.Schema {
		return {
			...rollCardSchema(),
			...metadata(),
		};
	}
}

export { A5eRollCardData };
