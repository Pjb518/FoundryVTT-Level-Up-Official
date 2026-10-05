import { createInitialGrant } from '#utils/createInitialGrant.ts';

import { A5EBaseItemData } from './base.ts';
import { GrantsField } from './Grants/GrantsField.ts';

import fields = foundry.data.fields;

const schema = {
	grants: new GrantsField({
		nullable: false,
		initial: () => ({
			...createInitialGrant('movement', {
				config: {
					movementTypes: { base: ['walk'] },
					bonus: '30',
					unit: 'feet',
				},
				name: 'Base Movement',
			}),
			// Traits
			...createInitialGrant('feature', {
				level: 1,
				levelType: 'character',
				name: 'Traits',
			}),
			// Heritage Gifts
			...createInitialGrant('feature', {
				config: {
					features: { total: 1 },
					selectionType: 'limited',
				},
				level: 1,
				levelType: 'character',
				name: 'Heritage Gifts',
			}),
			// Paragon Gifts
			...createInitialGrant('feature', {
				config: {
					features: { total: 1 },
					selectionType: 'limited',
				},
				level: 10,
				levelType: 'character',
				name: 'Paragon Gifts',
			}),
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
