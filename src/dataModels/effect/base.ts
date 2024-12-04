import { schemaData } from '../common';

const { fields } = foundry.data;

const baseSchema = () => ({
	applyToSelf: new fields.BooleanField({ required: true, nullable: false, initial: false }),
	effectType: new fields.StringField({ required: true, nullable: false, initial: 'passive' }),
	default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
});

declare namespace A5EBaseActiveEffectData {
	type Schema = DataSchema & ReturnType<typeof baseSchema> & ReturnType<typeof schemaData>;
	type BaseData = Record<string, unknown>;
	type DerivedData = Record<string, unknown>;
}

class A5EBaseActiveEffectData extends foundry.abstract.TypeDataModel<
	A5EBaseActiveEffectData.Schema,
	ActiveEffect.ConfiguredInstance,
	A5EBaseActiveEffectData.BaseData,
	A5EBaseActiveEffectData.DerivedData
> {
	static override defineSchema(): A5EBaseActiveEffectData.Schema {
		return {
			...baseSchema(),
			...schemaData(),
		};
	}
}

export { A5EBaseActiveEffectData };
