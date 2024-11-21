import type { ActionsData, ArmorData, UsesData } from './common';

import { A5EBaseItemData } from './base';
import { actions, armor, uses } from './common';

const { fields } = foundry.data;

const schema = {
  ammunitionProperties: new fields.ArrayField(
    new fields.StringField({ required: true, initial: '' }),
    { required: true, initial: [] }
  ),
  armorCategory: new fields.StringField({ required: true, initial: '' }),
  armorProperties: new fields.ArrayField(
    new fields.StringField({ required: true, initial: '' }),
    { required: true, initial: [] }
  ),
  attuned: new fields.BooleanField({ required: true, initial: false }),
  bulky: new fields.BooleanField({ required: true, initial: false }),
  breakerProperties: new fields.ArrayField(
    new fields.StringField({ required: true, initial: '' }),
    { required: true, initial: [] }
  ),
  capacity: new fields.SchemaField({
    type: new fields.StringField({ required: true, initial: 'weight' }),
    value: new fields.NumberField({ nullable: false, initial: 0, min: 0 }),
    weightlessContents: new fields.BooleanField({ required: true, initial: false })
  }),
  containerId: new fields.StringField({ required: true, initial: '' }),
  craftingComponents: new fields.StringField({ required: true, initial: '' }),
  damagedState: new fields.NumberField({
    required: true, initial: 0, integer: true, min: 0, max: 2
  }),
  defensiveProperties: new fields.StringField({ required: true, initial: '' }),
  equippedState: new fields.NumberField({
    required: true, initial: 0, integer: true, min: 0, max: 2
  }),
  flaws: new fields.ArrayField(
    new fields.StringField({ required: true, initial: '' }),
    { required: true, initial: [] }
  ),
  items: new fields.ObjectField({ required: true, initial: {} }),
  materialProperties: new fields.ArrayField(
    new fields.StringField({ required: true, initial: '' }),
    { required: true, initial: [] }
  ),
  mounted: new fields.ArrayField(
    new fields.StringField({ required: true, initial: '' }),
    { required: true, initial: [] }
  ),
  objectType: new fields.StringField({ required: true, initial: '' }),
  plotItem: new fields.BooleanField({ required: true, initial: false }),
  price: new fields.StringField({ required: true, initial: '' }),
  proficient: new fields.BooleanField({ required: true, initial: false }),
  quantity: new fields.NumberField({
    required: true, initial: 1, integer: true, min: 0
  }),
  rarity: new fields.StringField({ required: true, initial: 'mundane' }),
  requiresAttunement: new fields.BooleanField({ required: true, initial: false }),
  shieldCategory: new fields.StringField({ required: true, initial: '' }),
  shieldProperties: new fields.ArrayField(
    new fields.StringField({ required: true, initial: '' }),
    { required: true, initial: [] }
  ),
  supply: new fields.BooleanField({ required: true, initial: false }),
  techLevel: new fields.StringField({ required: true, initial: 'archaic' }),
  unidentified: new fields.BooleanField({ required: true, initial: false }),
  unidentifiedDescription: new fields.HTMLField({ required: true, initial: '' }),
  unidentifiedName: new fields.StringField({ required: true, initial: '' }),
  versatile: new fields.StringField({ required: true, initial: '' }),
  weaponProperties: new fields.ArrayField(
    new fields.StringField({ required: true, initial: '' }),
    { required: true, initial: [] }
  ),
  weight: new fields.NumberField({
    required: true, initial: 0, min: 0, nullable: false
  })
};

declare namespace A5EObjectData {
  type Schema = A5EBaseItemData.Schema & ActionsData & ArmorData & UsesData & typeof schema;
  type BaseData = A5EBaseItemData.BaseData;
  type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EObjectData extends A5EBaseItemData<
  A5EObjectData.Schema,
  A5EObjectData.BaseData,
  A5EObjectData.DerivedData
> {
  /** @inheritDoc */
  static override defineSchema(): A5EObjectData.Schema {
    return {
      ...super.defineSchema(),
      ...actions(),
      ...armor(),
      ...uses(),
      ...schema
    };
  }
}

// eslint-disable-next-line import/prefer-default-export
export { A5EObjectData };
