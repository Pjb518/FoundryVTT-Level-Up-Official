import MigrationRunner from '../../migration/MigrationRunner';

export type SchemaSchema = {
  schemaVersion: {
    version: number;
    lastMigration: {
      version: {
        schema: number | null;
        system?: string;
        foundry?: string;
      };
    } | null;
  }
};

/** @ts-ignore */
export default class SchemaDataModel extends foundry.abstract.DataModel {
  static defineSchema(): SchemaSchema {
    return {
      schemaVersion: new foundry.data.fields.SchemaField({
        version: new foundry.data.fields.NumberField({
          nullable: true, initial: MigrationRunner.LATEST_SCHEMA_VERSION
        }),
        lastMigration: new foundry.data.fields.SchemaField(
          {
            version: new foundry.data.fields.SchemaField({
              schema: new foundry.data.fields.NumberField({ nullable: true }),
              system: new foundry.data.fields.StringField({ nullable: true, required: false }),
              foundry: new foundry.data.fields.StringField({ nullable: true, required: false })
            })
          },
          { nullable: true, initial: null }
        )
      })
    };
  }
}
