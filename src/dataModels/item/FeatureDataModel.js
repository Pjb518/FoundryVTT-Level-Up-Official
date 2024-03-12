import A5EDataModel from '../A5EDataModel';
import Armor from './template/Armor';
import BaseItemData from './BaseItemData';

export default class FeatureDataModel extends A5EDataModel.mixin(BaseItemData, Armor) {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      concentration: new fields.BooleanField({ required: true, initial: false }),
      featureType: new fields.StringField({ required: true, initial: '' }),
      grants: new fields.ObjectField({ required: true, initial: {} }),
      prerequisite: new fields.StringField({ required: true, initial: '' }),
      requiresBlooded: new fields.BooleanField({ required: true, initial: false })
    });
  }
}
