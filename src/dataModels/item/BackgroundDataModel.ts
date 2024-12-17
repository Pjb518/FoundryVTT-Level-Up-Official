import { A5EBaseItemData } from './base';

const { fields } = foundry.data;

const schema = {
	grants: new fields.ObjectField({
		nullable: false,
		initial: () => ({
			// Default ASI
			[foundry.utils.randomID()]: {
				grantType: 'ability',
				abilities: { options: Object.keys(CONFIG.A5E.abilities), total: 1 },
				context: { types: ['base'] },
				bonus: '1',
				label: 'Default ASI',
			},
			// Skill Proficiency
			[foundry.utils.randomID()]: {
				grantType: 'proficiency',
				keys: { total: 1 },
				proficiencyType: 'skill',
				label: 'Skill Proficiencies',
			},
			// Feature
			[foundry.utils.randomID()]: {
				grantType: 'feature',
				label: 'Background Feature',
			},
			// Suggested Equipment
			[foundry.utils.randomID()]: {
				grantType: 'item',
				label: 'Suggested Equipment',
				optional: true,
			},
			// Trait Proficiency
			[foundry.utils.randomID()]: {
				grantType: 'proficiency',
				proficiencyType: 'tool',
				label: 'Tool Proficiencies',
			},
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
