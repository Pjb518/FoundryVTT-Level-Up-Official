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
  })

});

declare namespace A5EActionData {
  type Schema = DataSchema;
  interface BaseData { }
  interface DerivedData { }
}
