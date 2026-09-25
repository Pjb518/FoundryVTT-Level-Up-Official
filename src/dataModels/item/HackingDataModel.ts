import { A5EBaseItemData } from './base.ts';
import type { ActionsData, UsesData } from './common.ts';
import { actions, uses } from './common.ts';

import fields = foundry.data.fields;

const schema = {
	diceCost: new fields.NumberField({
		required: true,
		initial: 0,
		integer: true,
    nullable: false,
		min: 0,
	}),
};

declare namespace A5EHackingData {
	type Schema = A5EBaseItemData.Schema & ActionsData & UsesData & typeof schema;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EHackingData extends A5EBaseItemData<
	A5EHackingData.Schema,
	A5EHackingData.BaseData,
	A5EHackingData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5EHackingData.Schema {
		return {
			...super.defineSchema(),
			...actions(),
			...uses(),
			...schema,
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5EHackingData };
