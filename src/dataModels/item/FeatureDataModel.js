import Armor from './template/Armor';
import BaseItemData from './BaseItemData';

export default class FeatureDataModel extends BaseItemData.mixin(Armor) {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      concentration: new fields.BooleanField({ required: true, initial: false }),
      featureType: new fields.StringField({ required: true, initial: '' }),
      grants: new fields.ObjectField({ required: true, initial: {} }),
      level: new fields.SchemaField({
        context: new fields.StringField({ required: true, initial: 'class' }),
        grants: new fields.ObjectField({ required: true, initial: {} }),
        value: new fields.NumberField({ initial: 0, nullable: false })
      }),
      prerequisite: new fields.StringField({ required: true, initial: '' }),
      requiresBloodied: new fields.BooleanField({ required: true, initial: false })
    });
  }
}
