import { migrationData } from '../common.ts';
import { currency } from './common.ts';

import fields = foundry.data.fields;

const partySchema = () => ({
	attributes: new fields.SchemaField({
		movement: new fields.SchemaField({
			travel: new fields.SchemaField({
				distance: new fields.NumberField({
					persisted: false,
					required: true,
					nullable: false,
					initial: 0,
				}),
				unit: new fields.StringField({
					persisted: false,
					required: true,
					nullable: false,
					initial: 'feet',
				}),
			}),
		}),
	}),
	details: new fields.SchemaField({
		description: new fields.HTMLField({ required: true, nullable: false, initial: '' }),
		level: new fields.NumberField({ persisted: false, required: true, nullable: false, intial: 0 }),
		members: new fields.SetField(
			new fields.DocumentUUIDField({ required: true, nullable: false, initial: undefined }),
		),
	}),
});

declare namespace A5EPartyData {
	type Schema = DataSchema &
		ReturnType<typeof currency> &
		ReturnType<typeof partySchema> &
		ReturnType<typeof migrationData>;

	interface BaseData extends Record<string, any> {}
	interface DerivedData extends Record<string, any> {}
}

class A5EPartyData extends foundry.abstract.TypeDataModel<
	A5EPartyData.Schema,
	Actor.Implementation,
	A5EPartyData.BaseData,
	A5EPartyData.DerivedData
> {
	static override defineSchema(): A5EPartyData.Schema {
		return {
			...migrationData(),
			...currency(),
			...partySchema(),
		};
	}
}

export { A5EPartyData };
