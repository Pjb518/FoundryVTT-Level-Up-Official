import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';
import type { SchemaSchema } from '../template/SchemaDataModel';

type HeritageSchema = {
  description: string;
  features: Object;
  gifts: Object;
  paragonGifts: Object;
  schemaVersion: SchemaSchema;
};

export default class HeritageDataModel extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema(): HeritageSchema {
    return this.mergeSchema(super.defineSchema(), {
      description: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      features: new foundry.data.fields.ObjectField({ nullable: false, initial: {} }),
      gifts: new foundry.data.fields.ObjectField({ nullable: false, initial: {} }),
      paragonGifts: new foundry.data.fields.ObjectField({ nullable: false, initial: {} })
    });
  }
}
