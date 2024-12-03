import {
	abilities,
	attributes,
	bonuses,
	currency,
	details,
	grants,
	hitDice,
	proficiencies,
	resources,
	skills,
	spellBooks,
	traits,
} from './common';

import { schemaData, source } from '../common';

const { fields } = foundry.data;

const characterSchema = () => ({
	attributes: new fields.SchemaField({
		attunement: new fields.SchemaField({
			current: new fields.NumberField({ required: true, initial: 0, integer: true }),
			max: new fields.NumberField({ required: true, initial: 3, integer: true }),
		}),
		exertion: new fields.SchemaField({
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
			// @ts-expect-error
			recoverOnRest: new fields.BooleanField({ required: true, initial: true }),
		}),
		favorPoints: new fields.SchemaField({
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
		hitDice: new fields.SchemaField({
			...['d6', 'd8', 'd10', 'd12'].reduce((acc, die) => {
				acc[die] = hitDice();
				return acc;
			}, {}),
		}),
		...attributes(),
	}),
	details: new fields.SchemaField({
		age: new fields.StringField({ required: true, initial: '' }),
		appearance: new fields.StringField({ required: true, initial: '' }),
		archetype: new fields.StringField({ required: true, initial: '' }),
		background: new fields.StringField({ required: true, initial: '' }),
		classes: new fields.StringField({ required: true, initial: '' }),
		culture: new fields.StringField({ required: true, initial: '' }),
		destiny: new fields.StringField({ required: true, initial: '' }),
		eyeColor: new fields.StringField({ required: true, initial: '' }),
		gender: new fields.StringField({ required: true, initial: '' }),
		hairColor: new fields.StringField({ required: true, initial: '' }),
		heritage: new fields.StringField({ required: true, initial: '' }),
		height: new fields.StringField({ required: true, initial: '' }),
		level: new fields.NumberField({
			required: true,
			nullable: false,
			initial: 1,
			integer: true,
		}),
		notes: new fields.StringField({ required: true, initial: '' }),
		prestige: new fields.NumberField({ required: true, initial: 1, integer: true }),
		skinColor: new fields.StringField({ required: true, initial: '' }),
		weight: new fields.StringField({ required: true, initial: '' }),
		xp: new fields.NumberField({ required: true, initial: 0, integer: true }),
		...details(),
	}),
	classes: new fields.SchemaField({
		startingClass: new fields.StringField({ required: true, initial: '' }),
	}),
	resources: new fields.SchemaField(
		{
			classResources: new fields.ObjectField({ required: true, nullable: false }),
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
			override: new fields.NumberField({
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
			override: new fields.NumberField({
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
				nullable: true,
				initial: 0,
				min: 0,
			}),
			override: new fields.NumberField({
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
						nullable: true,
						initial: 0,
						min: 0,
					}),
					override: new fields.NumberField({
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
	supply: new fields.NumberField({
		required: true,
		initial: 0,
		integer: true,
		nullable: false,
	}),
});

declare namespace A5ECharacterData {
	type Schema = DataSchema &
		ReturnType<typeof abilities> &
		ReturnType<typeof bonuses> &
		ReturnType<typeof currency> &
		ReturnType<typeof grants> &
		ReturnType<typeof proficiencies> &
		ReturnType<typeof skills> &
		ReturnType<typeof spellBooks> &
		ReturnType<typeof traits> &
		ReturnType<typeof characterSchema> &
		ReturnType<typeof schemaData> &
		ReturnType<typeof source>;

	interface BaseData extends Record<string, any> {
		'attributes.prof': string;
	}
	interface DerivedData extends Record<string, any> {}
}

class A5ECharacterData extends foundry.abstract.TypeDataModel<
	A5ECharacterData.Schema,
	Actor.ConfiguredInstance,
	A5ECharacterData.BaseData,
	A5ECharacterData.DerivedData
> {
	static override defineSchema(): A5ECharacterData.Schema {
		return {
			...abilities(),
			...bonuses(),
			...currency(),
			...grants(),
			...proficiencies(),
			...skills(),
			...spellBooks(),
			...traits(),
			...characterSchema(),
			...source(),
			...schemaData(),
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5ECharacterData };
