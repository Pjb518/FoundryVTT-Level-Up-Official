import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';

export default class BaseActorData extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      abilities: new fields.ObjectField(),
      attributes: new fields.SchemaField({
        ac: new fields.SchemaField({
          baseFormula: new fields.StringField({ required: true, initial: '10 + dex' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true })
        }),
        death: new fields.SchemaField({
          success: new fields.NumberField({ required: true, initial: 0, integer: true }),
          failure: new fields.NumberField({ required: true, initial: 0, integer: true })
        }),
        hp: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          baseMax: new fields.NumberField({ required: true, initial: 10, integer: true }),
          temp: new fields.NumberField({ required: true, initial: 0, integer: true }),
          bonus: new fields.NumberField({ required: true, initial: 0, integer: true })
        }),
        hitDice: new fields.ObjectField(),
        initiative: new fields.SchemaField({
          bonus: new fields.StringField({ required: true, initial: '' }),
          expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true })
        }),
        movement: new fields.ObjectField(),
        senses: new fields.ObjectField(),
        inspiration: new fields.BooleanField({ required: true, initial: false }),
        fatigue: new fields.NumberField({ required: true, initial: 0, integer: true }),
        strife: new fields.NumberField({ required: true, initial: 0, integer: true }),
        spellcasting: new fields.StringField({ required: true, initial: 'int' })
      }),
      bonuses: new fields.ObjectField(),
      currency: new fields.ObjectField(),
      details: new fields.ObjectField(),
      proficiencies: new fields.ObjectField(),
      resources: new fields.ObjectField(),
      skills: new fields.ObjectField(),
      source: new fields.ObjectField(),
      traits: new fields.ObjectField(),
      spellResources: new fields.ObjectField()
    });
  }
}
