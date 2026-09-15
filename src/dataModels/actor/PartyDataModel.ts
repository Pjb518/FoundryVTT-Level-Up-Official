import { migrationData } from '../common.ts';

import fields = foundry.data.fields;

const partySchema = () => ({
	details: new fields.SchemaField({
		description: new fields.HTMLField({ required: true, nullable: false, initial: '' }),
		members: new fields.ArrayField(
			new fields.SchemaField({
				uuid: new fields.DocumentUUIDField({ required: true, nullable: false, initial: undefined }),
			}),
		),
	}),
});

declare namespace A5EPartyData {
	type Schema = DataSchema & ReturnType<typeof partySchema> & ReturnType<typeof migrationData>;

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
			...partySchema(),
		};
	}
}

export { A5EPartyData };
