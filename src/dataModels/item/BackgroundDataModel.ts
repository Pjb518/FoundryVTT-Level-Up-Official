import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';
import type { SchemaSchema } from '../template/SchemaDataModel';

type BackgroundSchema = {
  description: string;
  grants: Record<string, any>;
  schemaVersion: SchemaSchema;
};

export default class BackgroundDataModel extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema(): BackgroundSchema {
    return this.mergeSchema(super.defineSchema(), {
      description: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      grants: new foundry.data.fields.ObjectField({ nullable: false, initial: {} })
    });
  }
}
