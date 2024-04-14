export default class Level extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const { fields } = foundry.data;

    return {
      level: new fields.SchemaField({
        context: new fields.StringField({ required: true, initial: 'class' }),
        grants: new fields.ObjectField({ required: true, initial: {} }),
        value: new fields.NumberField({ initial: 0, nullable: false })
      })
    };
  }
}
