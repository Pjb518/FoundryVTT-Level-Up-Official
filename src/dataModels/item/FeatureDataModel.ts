import type { ActionsData, ArmorData, UsesData } from './common';

import { A5EBaseItemData } from './base';
import { actions, armor, uses } from './common';

const { fields } = foundry.data;

const schema = {
	asi: new fields.StringField({ required: true, initial: '' }),
  class: new fields.StringField({ required: true, initial: '' }),
	classes: new fields.StringField({ required: true, initial: '' }),
	concentration: new fields.BooleanField({ required: true, initial: false }),
  featClasses: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		required: true,
		initial: [],
	}),
  featType: new fields.StringField({ required: true, initial: '' }),
	featureType: new fields.StringField({ required: true, initial: '' }),
	grants: new fields.ObjectField({ required: true, initial: {} }),
	prerequisite: new fields.StringField({ required: true, initial: '' }),
	requiresBloodied: new fields.BooleanField({ required: true, initial: false }),
  synergy: new fields.StringField({ required: true, initial: '' }),
};

declare namespace A5EFeatureData {
	type Schema = A5EBaseItemData.Schema & ActionsData & ArmorData & UsesData & typeof schema;
	type BaseData = A5EBaseItemData.BaseData;
	type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EFeatureData extends A5EBaseItemData<
	A5EFeatureData.Schema,
	A5EFeatureData.BaseData,
	A5EFeatureData.DerivedData
> {
	/** @inheritDoc */
	static override defineSchema(): A5EFeatureData.Schema {
		return {
			...super.defineSchema(),
			...actions(),
			...armor(),
			...uses(),
			...schema,
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5EFeatureData };
