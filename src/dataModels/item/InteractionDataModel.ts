import type { ActionsData, UsesData } from './common';

import { A5EBaseItemData } from './base';
import { actions, uses } from './common';

const { fields } = foundry.data;

const schema = {
	interactionType: new fields.StringField({ required: true, initial: 'other' }),
	journeyProperties: new fields.SchemaField({
		criticalFailure: new fields.StringField({ required: true, initial: '' }),
		failure: new fields.StringField({ required: true, initial: '' }),
		success: new fields.StringField({ required: true, initial: '' }),
		criticalSuccess: new fields.StringField({ required: true, initial: '' }),
	}),
};

declare namespace A5EInteractionData {
	type Schema = A5EBaseItemData.Schema & ActionsData & UsesData & typeof schema;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EInteractionData extends A5EBaseItemData<
	A5EInteractionData.Schema,
	A5EInteractionData.BaseData,
	A5EInteractionData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5EInteractionData.Schema {
		return {
			...super.defineSchema(),
			...actions(),
			...uses(),
			...schema,
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5EInteractionData };
