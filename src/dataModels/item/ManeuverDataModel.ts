import type { ActionsData, UsesData } from './common';

import { A5EBaseItemData } from './base';
import { actions, uses } from './common';

const { fields } = foundry.data;

const schema = {
  concentration: new fields.BooleanField({ required: true, initial: false }),
  degree: new fields.NumberField({
    required: true, initial: 0, integer: true, min: 0
  }),
  exertionCost: new fields.NumberField({
    required: true, initial: 0, integer: true, min: 0
  }),
  isStance: new fields.BooleanField({ required: true, initial: false }),
  prerequisite: new fields.StringField({ required: true, initial: '' }),
  tradition: new fields.StringField({ required: true, initial: '' })
};

declare namespace A5EManeuverData {
  type Schema = A5EBaseItemData.Schema & ActionsData & UsesData & typeof schema;
  type BaseData = A5EBaseItemData.BaseData;
  type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EManeuverData extends A5EBaseItemData<
  A5EManeuverData.Schema,
  A5EManeuverData.BaseData,
  A5EManeuverData.DerivedData
> {
  /** @inheritDoc */
  static override defineSchema(): A5EManeuverData.Schema {
    return {
      ...super.defineSchema(),
      ...actions(),
      ...uses(),
      ...schema
    };
  }
}

// eslint-disable-next-line import/prefer-default-export
export { A5EManeuverData };
