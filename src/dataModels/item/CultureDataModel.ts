import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';
import type { SchemaSchema } from '../template/SchemaDataModel';

type CultureSchema = {
  description: string;
  grants: Record<string, any>;
  schemaVersion: SchemaSchema;
};

export default class CultureDataModel extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema(): CultureSchema {
    return this.mergeSchema(super.defineSchema(), {
      description: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      grants: new foundry.data.fields.ObjectField({
        nullable: false,
        initial: () => ({
          // Feature Grant
          [foundry.utils.randomID()]: {
            grantType: 'feature',
            label: 'Culture Features'
          },
          // Languages
          [foundry.utils.randomID()]: {
            grantType: 'trait',
            traits: { traitType: 'languages' },
            label: 'Languages'
          }
        })
      })
    });
  }
}
