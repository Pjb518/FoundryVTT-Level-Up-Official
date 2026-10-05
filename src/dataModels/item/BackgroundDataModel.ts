import { createInitialGrant } from '#utils/createInitialGrant.ts';

import { A5EBaseItemData } from './base.ts';
import { GrantsField } from './Grants/GrantsField.ts';

import fields = foundry.data.fields;

const schema = {
	grants: new GrantsField({
		nullable: false,
		initial: () => ({
			// Default ASI
			...createInitialGrant('ability', {
				config: {
					abilities: { options: Object.keys(CONFIG.A5E.abilities), total: 1 },
					context: { types: ['base'] },
					bonus: '1',
				},
				name: 'Default ASI',
			}),
			// Skill Proficiency
			...createInitialGrant('proficiency', {
				config: {
					keys: { total: 1 },
				},
				name: 'Skill Proficiencies',
			}),
			// Feature
			...createInitialGrant('feature', {
				grantType: 'feature',
				name: 'Background Feature',
			}),
			// Suggested Equipment
			...createInitialGrant('item', {
				name: 'Suggested Equipment',
				optional: true,
			}),
			// Trait Proficiency
			...createInitialGrant('proficiency', {
				config: {},
				name: 'Tool Proficiencies',
			}),
		}),
	}),
};

declare namespace A5EBackgroundData {
	type Schema = A5EBaseItemData.Schema & typeof schema;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EBackgroundData extends A5EBaseItemData<
	A5EBackgroundData.Schema,
	A5EBackgroundData.BaseData,
	A5EBackgroundData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5EBackgroundData.Schema {
		return {
			...super.defineSchema(),
			...schema,
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5EBackgroundData };
