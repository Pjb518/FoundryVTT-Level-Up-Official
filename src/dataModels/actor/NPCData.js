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
        cr: new fields.NumberField({ required: true, initial: 0, integer: true }),
        elite: new fields.BooleanField({ required: true, initial: false }),
        privateNotes: new fields.StringField({ required: true, initial: '' })
      })
    });
  }
}
