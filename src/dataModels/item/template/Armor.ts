export default class ArmorDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const { fields } = foundry.data;

    return {
      baseFormula: new fields.StringField({ required: true, initial: '' }),
      formula: new fields.StringField({ required: true, initial: '' }),
      grantsDisadvantage: new fields.BooleanField({ required: true, initial: false }),
      maxDex: new fields.NumberField({ required: true, initial: 0, min: 0 }),
      minStr: new fields.NumberField({ required: true, initial: 0, min: 0 }),
      mode: new fields.NumberField({ required: true, initial: 2 }),
      requiresNoShield: new fields.BooleanField({ required: true, initial: false }),
      requiresUnarmored: new fields.BooleanField({ required: true, initial: false })
    };
  }
}
