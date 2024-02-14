import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';
import type { SchemaSchema } from '../template/SchemaDataModel';

type BackgroundSchema = {
  description: string;
  grants: Record<string, any>;
  defaultASI: string;
  includesASI: boolean;
  equipment: Object;
  feature: string;
  proficiencies: {
    languages: {
      count: number;
      fixed: string[];
      options: string[];
    },
    skills: {
      count: number;
      fixed: string[];
      options: string[];
    },
    tools: {
      count: number;
      options: string;
    },
    weapons: {
      count: number;
      options: string;
    },
    armor: {
      count: number;
      fixed: string[];
      options: string[];
    }
  },
  schemaVersion: SchemaSchema;
};

export default class BackgroundDataModel extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema(): BackgroundSchema {
    return this.mergeSchema(super.defineSchema(), {
      description: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      grants: new foundry.data.fields.ObjectField({ nullable: false, initial: {} }),
      defaultASI: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      includesASI: new foundry.data.fields.BooleanField({ nullable: false, initial: true }),
      equipment: new foundry.data.fields.ObjectField({ nullable: false, initial: {} }),
      feature: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
      proficiencies: new foundry.data.fields.SchemaField({
        armor: new foundry.data.fields.SchemaField({
          count: new foundry.data.fields.NumberField({
            integer: true, nullable: false, initial: 0
          }),
          fixed: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField()),
          options: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField())
        }),
        languages: new foundry.data.fields.SchemaField({
          count: new foundry.data.fields.NumberField({
            integer: true, nullable: false, initial: 0
          }),
          fixed: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField()),
          options: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField())
        }),
        skills: new foundry.data.fields.SchemaField({
          count: new foundry.data.fields.NumberField({
            integer: true, nullable: false, initial: 2
          }),
          fixed: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField()),
          options: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField())
        }),
        tools: new foundry.data.fields.SchemaField({
          count: new foundry.data.fields.NumberField({
            integer: true, nullable: false, initial: 0
          }),
          options: new foundry.data.fields.StringField({ nullable: false, initial: '' })
        }),
        weapons: new foundry.data.fields.SchemaField({
          count: new foundry.data.fields.NumberField({
            integer: true, nullable: false, initial: 0
          }),
          options: new foundry.data.fields.StringField({ nullable: false, initial: '' })
        })
      })
    });
  }
}
