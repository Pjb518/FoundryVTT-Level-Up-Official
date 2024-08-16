import { metadata } from './common';

const { fields } = foundry.data;

const rollTableCardSchema = () => ({
  description: new fields.HTMLField({ required: true, nullable: false, initial: '' }),
  title: new fields.StringField({ required: true, nullable: false, initial: '' })
});

declare namespace A5eRollTableOutputCardData {
  type Schema = DataSchema
    & ReturnType<typeof metadata>
    & ReturnType<typeof rollTableCardSchema>;
  interface BaseData extends Record<string, unknown> { }
  interface DerivedData extends Record<string, unknown> { }
}

class A5eRollTableOutputCardData extends foundry.abstract.TypeDataModel<
  A5eRollTableOutputCardData.Schema,
  ChatMessage.ConfiguredInstance,
  A5eRollTableOutputCardData.BaseData,
  A5eRollTableOutputCardData.DerivedData
> {
  static override defineSchema(): A5eRollTableOutputCardData.Schema {
    return {
      ...rollTableCardSchema(),
      ...metadata()
    };
  }
}

export { A5eRollTableOutputCardData };
