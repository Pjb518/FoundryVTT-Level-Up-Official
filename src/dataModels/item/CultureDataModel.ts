import { A5EBaseItemData } from './base.ts';

import fields = foundry.data.fields;

const schema = {
	grants: new fields.ObjectField({
		nullable: false,
		initial: () => ({
			// Feature Grant
			[foundry.utils.randomID()]: {
				grantType: 'feature',
				label: 'Culture Features',
			},
			// Languages
			[foundry.utils.randomID()]: {
				grantType: 'trait',
				traits: { traitType: 'languages' },
				label: 'Languages',
			},
		}),
	}),
};

declare namespace A5ECultureData {
	type Schema = A5EBaseItemData.Schema & typeof schema;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5ECultureData extends A5EBaseItemData<
	A5ECultureData.Schema,
	A5ECultureData.BaseData,
	A5ECultureData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5ECultureData.Schema {
		return {
			...super.defineSchema(),
			...schema,
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5ECultureData };
