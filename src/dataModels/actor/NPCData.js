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
        isSquad: new fields.BooleanField({ required: true, initial: false }),
        notes: new fields.HTMLField({ required: true, initial: '' }),
        privateNotes: new fields.HTMLField({ required: true, initial: '' }),
        terrain: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        )
      }),
      spellResources: new fields.SchemaField({
        artifactCharges: new fields.SchemaField({
          current: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
          max: new fields.NumberField({ nullable: false, initial: 0, integer: true })
        }),
        inventions: new fields.SchemaField({
          current: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
          max: new fields.NumberField({ nullable: false, initial: 0, integer: true })
        }),
        points: new fields.SchemaField({
          current: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
          max: new fields.NumberField({ nullable: false, initial: 0, integer: true })
        }),
        slots: new fields.SchemaField(
          Array.from({ length: 9 }, (_, i) => i + 1)
            .reduce((acc, level) => {
              acc[level] = new fields.SchemaField({
                current: new fields.NumberField({ nullable: false, initial: 0, min: 0 }),
                max: new fields.NumberField({ nullable: false, initial: 0, min: 0 })
              });
              return acc;
            }, {})

        )
      }),
      source: new fields.StringField({ required: false, initial: '' })
    });
  }
}
