import {
	abilities,
	attributes,
	bonuses,
	currency,
	details,
	grants,
	proficiencies,
	resources,
	skills,
	spellBooks,
	traits,
} from './common';

import { schemaData, source } from '../common';

const { fields } = foundry.data;

const npcSchema = () => ({
	attributes: new fields.SchemaField({
		casterLevel: new fields.NumberField({ required: true, initial: 0, integer: true }),
		hitDice: new fields.SchemaField({
			...['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].reduce((acc, die) => {
				acc[die] = new fields.SchemaField({
					current: new fields.NumberField({
						required: true,
						initial: 0,
						integer: true,
						min: 0,
					}),
					total: new fields.NumberField({
						required: true,
						initial: 0,
						integer: true,
						min: 0,
					}),
				});
				return acc;
			}, {}),
		}),
		...attributes(),
	}),
	details: new fields.SchemaField({
		cr: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		// @ts-expect-error
		elite: new fields.BooleanField({ required: true, initial: false }),
		// @ts-expect-error
		isSquad: new fields.BooleanField({ required: true, initial: false }),
		// @ts-expect-error
		isSwarm: new fields.BooleanField({ required: true, initial: false }),
		notes: new fields.HTMLField({ required: true, initial: '' }),
		privateNotes: new fields.HTMLField({ required: true, initial: '' }),
		terrain: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			required: true,
			initial: [],
		}),
		...details(),
	}),
	resources: new fields.SchemaField(
		{
			...resources(),
		},
		{ required: true, nullable: false },
	),
	spellResources: new fields.SchemaField({
		artifactCharges: new fields.SchemaField({
			current: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
				integer: true,
			}),
			max: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
				integer: true,
			}),
		}),
		inventions: new fields.SchemaField({
			current: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
				integer: true,
			}),
			max: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
				integer: true,
			}),
		}),
		points: new fields.SchemaField({
			current: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
				integer: true,
			}),
			max: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
				integer: true,
			}),
		}),
		slots: new fields.SchemaField(
			Array.from({ length: 9 }, (_, i) => i + 1).reduce((acc, level) => {
				acc[level] = new fields.SchemaField({
					current: new fields.NumberField({
						required: true,
						nullable: false,
						initial: 0,
						min: 0,
					}),
					max: new fields.NumberField({
						required: true,
						nullable: false,
						initial: 0,
						min: 0,
					}),
				});
				return acc;
			}, {}),
		),
	}),
});

declare namespace A5ENPCData {
	type Schema = DataSchema &
		ReturnType<typeof abilities> &
		ReturnType<typeof bonuses> &
		ReturnType<typeof currency> &
		ReturnType<typeof grants> &
		ReturnType<typeof proficiencies> &
		ReturnType<typeof skills> &
		ReturnType<typeof spellBooks> &
		ReturnType<typeof traits> &
		ReturnType<typeof npcSchema> &
		ReturnType<typeof schemaData> &
		ReturnType<typeof source>;

	interface BaseData extends Record<string, any> {
		'attributes.prof': string;
	}

	interface DerivedData extends Record<string, any> {}
}

class A5ENPCData extends foundry.abstract.TypeDataModel<
	A5ENPCData.Schema,
	Actor.ConfiguredInstance,
	A5ENPCData.BaseData,
	A5ENPCData.DerivedData
> {
	static override defineSchema(): A5ENPCData.Schema {
		return {
			...abilities(),
			...bonuses(),
			...currency(),
			...grants(),
			...proficiencies(),
			...skills(),
			...spellBooks(),
			...traits(),
			...source(),
			...schemaData(),
			...npcSchema(),
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5ENPCData };
