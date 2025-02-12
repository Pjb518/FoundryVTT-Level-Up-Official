import A5EDataModel from '../../A5EDataModel';

export default class ActorBaseGrant extends A5EDataModel {
	// Declare Schema Variables
	declare itemUuid: string;

	declare grantId: string;

	declare grantType: string;

	declare level: number;

	constructor(data: Record<string, any>, options = {}) {
		// @ts-ignore
		super(data, options);
	}

	static defineSchema() {
		const { fields } = foundry.data;

		return {
			// TODO: v12 - Update to UUIDField in v12
			itemUuid: new fields.StringField({ required: true, initial: '' }),
			// itemUuid: new fields.DocumentUUIDField({ required: true, initial: '' }),
			grantId: new fields.DocumentIdField({ required: true, initial: '' }),
			grantType: new fields.StringField({ required: true, initial: '' }),
			level: new fields.NumberField({
				nullable: false,
				initial: 1,
				integer: true,
				min: 1,
			}),
		};
	}
}
