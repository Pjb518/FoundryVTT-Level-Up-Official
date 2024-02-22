import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';
import type { SchemaSchema } from '../template/SchemaDataModel';

type DestinySchema = {
  description: string;
  sourceOfInspiration: string;
  inspirationFeature: string;
  fulfillmentFeature: string;
  schemaVersion: SchemaSchema;
};

export default class DestinyDataModel extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema(): DestinySchema {
    return this.mergeSchema(super.defineSchema(), {
      description: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      sourceOfInspiration: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      inspirationFeature: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      fulfillmentFeature: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      source: new foundry.data.fields.StringField({ nullable: false, initial: '' })
    });
  }
}
