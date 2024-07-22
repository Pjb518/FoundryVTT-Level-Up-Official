const { fields } = foundry.data;

const actionSchema = () => ({
  name: new fields.StringField({ required: true, nullable: false, initial: 'New Action' }),
  description: new fields.StringField({ required: true, nullable: false, initial: '' }),
  descriptionOutputs: new fields.ArrayField(
    new fields.StringField({ required: true, nullable: false, choices: ['action', 'item'] }),
    { required: true, initial: ['item', 'action'] }
  ),
  img: new fields.StringField({ required: true, initial: '' }),
  activation: new fields.SchemaField({
    cost: new fields.StringField({ required: true, nullable: false, initial: '' }),
    type: new fields.StringField({ required: true, nullable: true, initial: '' }),
    reactionTrigger: new fields.StringField({ required: true, nullable: false, initial: '' })
  }),
  area: new fields.ObjectField({ required: false, nullable: true, initial: () => undefined }),
  duration: new fields.SchemaField({
    unit: new fields.StringField({ required: true, nullable: false, initial: '' }),
    value: new fields.NumberField({ required: true, nullable: true })
  }),

  // TODO: Types - Fix this
  consumers: new fields.ObjectField({ required: true, nullable: false }),

  // TODO: Types - Fix this
  prompts: new fields.ObjectField({ required: true, nullable: false }),

  // TODO: Types - Fix this
  ranges: new fields.ObjectField({ required: true, nullable: false }),

  // TODO: Types - Fix this
  rolls: new fields.ObjectField({ required: true, nullable: false }),

  target: new fields.SchemaField({
    quantity: new fields.NumberField({ required: true, nullable: true }),
    scaling: new fields.ObjectField({ required: true, nullable: false }),
    type: new fields.StringField({ required: true, nullable: false, initial: '' })
  }),

  uses: new fields.SchemaField({
    value: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
    max: new fields.StringField({ required: true, nullable: false, initial: '' }),
    per: new fields.StringField({ required: true, nullable: false, initial: '' }),
    recharge: new fields.SchemaField({
      formula: new fields.StringField({ required: true, nullable: false }),
      threshold: new fields.NumberField({ required: true, nullable: false, initial: 0 })
    })
  })
});

declare namespace A5EActionData {
  type Schema = DataSchema & ReturnType<typeof actionSchema>;
  interface BaseData { }
  interface DerivedData { }
}

class A5EActionData extends foundry.abstract.TypeDataModel<
  A5EActionData.Schema,
  foundry.abstract.Document<DataSchema, any, any>,
  A5EActionData.BaseData,
  A5EActionData.DerivedData
> {
  static override defineSchema(): A5EActionData.Schema {
    return {
      ...actionSchema()
    };
  }
}

export { A5EActionData };
