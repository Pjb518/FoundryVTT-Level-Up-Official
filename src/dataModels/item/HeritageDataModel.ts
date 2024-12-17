import { A5EBaseItemData } from './base';

const { fields } = foundry.data;

const schema = {
	grants: new fields.ObjectField({
		nullable: false,
		initial: () => ({
			[foundry.utils.randomID()]: {
				grantType: 'movement',
				movementTypes: { base: ['walk'] },
				bonus: '30',
				unit: 'feet',
				label: 'Base Movement',
			},
		}),
	}),
};

declare namespace A5EHeritageData {
	type Schema = A5EBaseItemData.Schema & typeof schema;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EHeritageData extends A5EBaseItemData<
	A5EHeritageData.Schema,
	A5EHeritageData.BaseData,
	A5EHeritageData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5EHeritageData.Schema {
		return {
			...super.defineSchema(),
			...schema,
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5EHeritageData };
