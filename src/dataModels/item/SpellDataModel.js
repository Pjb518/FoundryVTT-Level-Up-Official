import BaseItemData from './BaseItemData';

export default class SpellDataModel extends BaseItemData {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      classes: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      ),
      components: new fields.SchemaField({
        vocalized: new fields.BooleanField({ required: true, initial: false }),
        seen: new fields.BooleanField({ required: true, initial: false }),
        material: new fields.BooleanField({ required: true, initial: false })
      }),
      level: new fields.NumberField({
        required: true, initial: 0, integer: true, min: 0
      }),
      materials: new fields.StringField({ required: true, initial: '' }),
      materialsConsumed: new fields.BooleanField({ required: true, initial: false }),
      prepared: new fields.BooleanField({ required: true, initial: false }),
      prerequisite: new fields.StringField({ required: true, initial: '' }),
      rare: new fields.BooleanField({ required: true, initial: false }),
      ritual: new fields.BooleanField({ required: true, initial: false }),
      schools: new fields.SchemaField({
        primary: new fields.StringField({ required: true, initial: '' }),
        secondary: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        )
      })
    });
  }
}
