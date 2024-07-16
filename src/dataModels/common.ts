import MigrationRunner from '../migration/MigrationRunner';

const { fields } = foundry.data;

// eslint-disable-next-line import/prefer-default-export
export const schemaData = () => ({
  schemaVersion: new fields.SchemaField({
    version: new fields.NumberField({
      nullable: true,
      initial: MigrationRunner.LATEST_SCHEMA_VERSION
    }),
    lastMigration: new fields.SchemaField(
      {
        version: new fields.SchemaField({
          schema: new fields.NumberField({ nullable: true }),
          system: new fields.StringField({ nullable: true, required: false }),
          foundry: new fields.StringField({ nullable: true, required: false })
        })
      },
      { nullable: true, initial: null }
    )
  })
});

export type SchemaData = ReturnType<typeof schemaData>;

// -----------------------------------------
// Source
// -----------------------------------------
export const source = () => ({
  source: new fields.StringField({ required: true, initial: '' })
});

export type Source = ReturnType<typeof source>;
