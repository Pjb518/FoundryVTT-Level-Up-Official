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
      supply: new fields.NumberField({ required: true, initial: 0, integer: true })
    });
  }
}
