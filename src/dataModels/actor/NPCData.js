import BaseActorData from './BaseActorData';

export default class NPCData extends BaseActorData {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      attributes: new fields.SchemaField({
        casterLevel: new fields.NumberField({ required: true, initial: 0, integer: true }),
        hitDice: new fields.SchemaField({
          d4: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            total: new fields.NumberField({ required: true, initial: 0, integer: true })
          }),
          d20: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            total: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        })
      }),
      details: new fields.SchemaField({
        cr: new fields.NumberField({ required: true, initial: 0 }),
        elite: new fields.BooleanField({ required: true, initial: false }),
        notes: new fields.HTMLField({ required: true, initial: '' }),
        privateNotes: new fields.HTMLField({ required: true, initial: '' }),
        terrain: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        )
      })
    });
  }
}
