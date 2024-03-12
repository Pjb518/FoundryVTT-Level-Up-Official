import BaseItemData from './BaseItemData';

export default class ManeuverDataModel extends BaseItemData {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      concentration: new fields.BooleanField({ required: true, initial: false }),
      degree: new fields.NumberField({
        required: true, initial: 0, integer: true, min: 0
      }),
      exertionCost: new fields.NumberField({
        required: true, initial: 0, integer: true, min: 0
      }),
      isStance: new fields.BooleanField({ required: true, initial: false }),
      prerequisite: new fields.StringField({ required: true, initial: '' }),
      tradition: new fields.StringField({ required: true, initial: '' })
    });
  }
}
