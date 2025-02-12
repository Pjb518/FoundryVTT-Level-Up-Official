export default class SubObjectField extends foundry.abstract.TypeDataModel {
	declare _id: string;

	declare quantity: number;

	declare quantityOverride: number;

	declare uuid: string;

	static defineSchema() {
		const { fields } = foundry.data;
		return {
			_id: new fields.StringField({ required: true, initial: '' }),
			quantity: new fields.NumberField({ nullable: false, initial: 1 }),
			quantityOverride: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
			uuid: new fields.StringField({ required: true, initial: '' }),
		};
	}
}
