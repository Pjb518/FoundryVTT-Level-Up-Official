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
      supply: new fields.NumberField({ required: true, initial: 0, integer: true })
    });
  }
}
