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
      grants: new foundry.data.fields.ObjectField({
        nullable: false,
        initial: () => ({
          // Default ASI
          [foundry.utils.randomID()]: {
            grantType: 'ability',
            abilities: { options: Object.keys(CONFIG.A5E.abilities), total: 1 },
            context: { types: ['base'] },
            bonus: '1',
            label: 'Default ASI'
          },
          // Skill Proficiency
          [foundry.utils.randomID()]: {
            grantType: 'proficiency',
            keys: { total: 1 },
            proficiencyType: 'skill',
            label: 'Skill Proficiencies'
          },
          // Feature
          [foundry.utils.randomID()]: {
            grantType: 'feature',
            label: 'Background Feature'
          },
          // Suggested Equipment
          [foundry.utils.randomID()]: {
            grantType: 'item',
            label: 'Suggested Equipment',
            optional: true
          },
          // Trait Proficiency
          [foundry.utils.randomID()]: {
            grantType: 'trait',
            traits: { traitType: 'tools' },
            label: 'Tool Proficiencies'
          }
        })
      }),
      source: new foundry.data.fields.StringField({ nullable: false, initial: '' })
    });
  }
}
