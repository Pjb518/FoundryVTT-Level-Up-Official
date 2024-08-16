import { metadata } from './common';

const { fields } = foundry.data;

const itemCardSchema = () => ({
  actionName: new fields.StringField({ required: true, nullable: false, initial: '' }),
  actionId: new fields.StringField({ required: false, nullable: true }),
  actionDescription: new fields.HTMLField({ required: true, nullable: false, initial: '' }),
  castingLevel: new fields.NumberField({ required: true, nullable: true }),
  itemDescription: new fields.HTMLField({ required: true, nullable: false, initial: '' }),
  itemId: new fields.StringField({ required: true, nullable: false, initial: '' }),
  prompts: new fields.ArrayField(new fields.ObjectField({ required: true, nullable: false })),
  rollData: new fields.ArrayField(new fields.ObjectField({ required: true, nullable: false })),
  summaryData: new fields.ObjectField({ required: true, nullable: false }),
  unidentifiedDescription: new fields.HTMLField({ required: true, nullable: false, initial: '' })
});

declare namespace A5eItemCardData {
  type Schema = DataSchema
    & ReturnType<typeof metadata>
    & ReturnType<typeof itemCardSchema>;
  interface BaseData extends Record<string, unknown> { }
  interface DerivedData extends Record<string, unknown> { }
}

class A5eItemCardData extends foundry.abstract.TypeDataModel<
  A5eItemCardData.Schema,
  ChatMessage.ConfiguredInstance,
  A5eItemCardData.BaseData,
  A5eItemCardData.DerivedData
> {
  static override defineSchema(): A5eItemCardData.Schema {
    return {
      ...itemCardSchema(),
      ...metadata()
    };
  }
}

export { A5eItemCardData };
