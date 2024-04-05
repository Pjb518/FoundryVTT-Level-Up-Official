import BaseActorData from './BaseActorData';

export default class CharacterData extends BaseActorData {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      attributes: new fields.SchemaField({
        attunement: new fields.SchemaField({
          current: new fields.NumberField({ required: true, initial: 0, integer: true }),
          max: new fields.NumberField({ required: true, initial: 3, integer: true })
        }),
        exertion: new fields.SchemaField({
          current: new fields.NumberField({ required: true, initial: 0, integer: true }),
          max: new fields.NumberField({ required: true, initial: 0, integer: true }),
          recoverOnRest: new fields.BooleanField({ required: true, initial: true })
        })
      }),
      classes: new fields.SchemaField({
        startingClass: new fields.StringField({ required: true, initial: '' })
      }),
      details: new fields.SchemaField({
        age: new fields.StringField({ required: true, initial: '' }),
        appearance: new fields.StringField({ required: true, initial: '' }),
        archetype: new fields.StringField({ required: true, initial: '' }),
        background: new fields.StringField({ required: true, initial: '' }),
        classes: new fields.StringField({ required: true, initial: '' }),
        culture: new fields.StringField({ required: true, initial: '' }),
        destiny: new fields.StringField({ required: true, initial: '' }),
        eyeColor: new fields.StringField({ required: true, initial: '' }),
        gender: new fields.StringField({ required: true, initial: '' }),
        hairColor: new fields.StringField({ required: true, initial: '' }),
        heritage: new fields.StringField({ required: true, initial: '' }),
        height: new fields.StringField({ required: true, initial: '' }),
        level: new fields.NumberField({ required: true, initial: 1, integer: true }),
        notes: new fields.StringField({ required: true, initial: '' }),
        prestige: new fields.NumberField({ required: true, initial: 1, integer: true }),
        skinColor: new fields.StringField({ required: true, initial: '' }),
        weight: new fields.StringField({ required: true, initial: '' }),
        xp: new fields.NumberField({ required: true, initial: 0, integer: true })
      }),
      proficiencies: new fields.SchemaField({
        traditions: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        )
      }),
      spellResources: new fields.SchemaField({
        artifactCharges: new fields.SchemaField({
          current: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
          override: new fields.NumberField({ nullable: false, initial: 0, integer: true })
        }),
        inventions: new fields.SchemaField({
          current: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
          override: new fields.NumberField({ nullable: false, initial: 0, integer: true })
        }),
        points: new fields.SchemaField({
          current: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
          override: new fields.NumberField({ nullable: false, initial: 0, integer: true })
        }),
        slots: new fields.SchemaField(
          Array.from({ length: 9 }, (_, i) => i + 1)
            .reduce((acc, level) => {
              acc[level] = new fields.SchemaField({
                current: new fields.NumberField({ nullable: false, initial: 0, min: 0 }),
                override: new fields.NumberField({ nullable: false, initial: 0, min: 0 })
              });
              return acc;
            }, {})

        )
      }),
      supply: new fields.NumberField({ required: true, initial: 0, integer: true })
    });
  }
}
