import type { ActionsData, UsesData } from './common';

import { A5EBaseItemData } from './base';
import { actions, uses } from './common';

const { fields } = foundry.data;

const schema = {
	activityType: new fields.StringField({ required: true, initial: '' }),
	journeyProperties: new fields.ArrayField(
		new fields.SchemaField({
			criticalFailure: new fields.StringField({ required: false, initial: '' }),
			failure: new fields.StringField({ required: false, initial: '' }),
			success: new fields.StringField({ required: false, initial: '' }),
			criticalSuccess: new fields.StringField({ required: false, initial: '' }),
		}),
	),
};

declare namespace A5EActivityData {
	type Schema = A5EBaseItemData.Schema & ActionsData & UsesData & typeof schema;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EActivityData extends A5EBaseItemData<
	A5EActivityData.Schema,
	A5EActivityData.BaseData,
	A5EActivityData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5EActivityData.Schema {
		return {
			...super.defineSchema(),
			...actions(),
			...uses(),
			...schema,
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5EActivityData };
