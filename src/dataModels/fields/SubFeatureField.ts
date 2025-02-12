export default class SubFeature extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const { fields } = foundry.data;
		return {
			isValid: fields.BooleanField({ initial: true }),
			isOptional: fields.BooleanField({ initial: false }),
			quantityOverride: fields.NumberField({ initial: 0, integer: true, min: 0 }),
			sourceUuid: fields.StringField({ initial: '' }),
			uuid: fields.StringField({ required: true, initial: '' }),
		};
	}
}
