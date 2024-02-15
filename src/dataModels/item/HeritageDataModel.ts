import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';
import type { SchemaSchema } from '../template/SchemaDataModel';

type HeritageSchema = {
  description: string;
  grants: Record<string, any>;
  schemaVersion: SchemaSchema;
};

export default class HeritageDataModel extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema(): HeritageSchema {
    return this.mergeSchema(super.defineSchema(), {
      description: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      grants: new foundry.data.fields.ObjectField({
        nullable: false,
        initial: () => ({
          [foundry.utils.randomID()]: {
            grantType: 'movement',
            movementTypes: { base: ['walk'] },
            bonus: '30',
            unit: 'feet',
            label: 'Base Movement'
          }
        })
      })
    });
  }
}
