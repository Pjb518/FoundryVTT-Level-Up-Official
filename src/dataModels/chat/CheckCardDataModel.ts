import { metadata } from './common';

const { fields } = foundry.data;

const checkCardSchema = () => ({
  rollData: new fields.ArrayField(new fields.ObjectField({ required: true, nullable: false })),
  rollType: new fields.StringField({
    required: true,
    nullable: false,
    initial: 'abilityCheck',
    choices: ['abilityCheck', 'hitDice', 'initiative', 'savingThrow', 'skillCheck']
  })
});

declare namespace A5eCheckCardData {
  type Schema = DataSchema
    & ReturnType<typeof metadata>
    & ReturnType<typeof checkCardSchema>;
  interface BaseData extends Record<string, unknown> { }
  interface DerivedData extends Record<string, unknown> { }
}

class A5eCheckCardData extends foundry.abstract.TypeDataModel<
  A5eCheckCardData.Schema,
  ChatMessage.ConfiguredInstance,
  A5eCheckCardData.BaseData,
  A5eCheckCardData.DerivedData
> {
  static override defineSchema(): A5eCheckCardData.Schema {
    return {
      ...checkCardSchema(),
      ...metadata()
    };
  }
}

export { A5eCheckCardData };
