import { A5EBaseItemData } from './base';

const { fields } = foundry.data;

const schema = {
  sourceOfInspiration: new fields.StringField({ nullable: false, initial: '' }),
  inspirationFeature: new fields.StringField({ nullable: false, initial: '' }),
  fulfillmentFeature: new fields.StringField({ nullable: false, initial: '' })
};

declare namespace A5EDestinyData {
  type Schema = A5EBaseItemData.Schema & typeof schema;
  type BaseData = A5EBaseItemData.BaseData;
  type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EDestinyData extends A5EBaseItemData<
  A5EDestinyData.Schema,
  A5EDestinyData.BaseData,
  A5EDestinyData.DerivedData
> {
  /** @inheritDoc */
  static override defineSchema(): A5EDestinyData.Schema {
    return {
      ...super.defineSchema(),
      ...schema
    };
  }
}

// eslint-disable-next-line import/prefer-default-export
export { A5EDestinyData };
