import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';
import type { SchemaSchema } from '../template/SchemaDataModel';

type HeritageSchema = {
  description: string;
  creatureTypes: string[];
  creatureSize: string;
  features: Object;
  giftCategories: Object;
  gifts: Object;
  paragonCategories: Object;
  paragonGifts: Object;
  paragonLevel: number;
  schemaVersion: SchemaSchema;
};

export default class HeritageDataModel extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema(): HeritageSchema {
    return this.mergeSchema(super.defineSchema(), {
      description: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      creatureTypes: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField({ nullable: false, initial: '' })),
      creatureSize: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      giftCategories: new foundry.data.fields.ObjectField({ nullable: false, initial: {} }),
      features: new foundry.data.fields.ObjectField({ nullable: false, initial: {} }),
      gifts: new foundry.data.fields.ObjectField({ nullable: false, initial: {} }),
      paragonCategories: new foundry.data.fields.ObjectField({ nullable: false, initial: {} }),
      paragonGifts: new foundry.data.fields.ObjectField({ nullable: false, initial: {} }),
      paragonLevel: new foundry.data.fields.NumberField({
        nullable: false, initial: 0, integer: true
      })
    });
  }
}
