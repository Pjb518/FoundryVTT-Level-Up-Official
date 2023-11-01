import MigrationRunner from '../../migration/MigrationRunner';
export default class SchemaDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            schemaVersion: new foundry.data.fields.SchemaField({
                version: new foundry.data.fields.NumberField({
                    nullable: true, initial: MigrationRunner.LATEST_SCHEMA_VERSION
                }),
                lastMigration: new foundry.data.fields.SchemaField({
                    version: new foundry.data.fields.SchemaField({
                        schema: new foundry.data.fields.NumberField({ nullable: true }),
                        system: new foundry.data.fields.StringField({ nullable: true, required: false }),
                        foundry: new foundry.data.fields.StringField({ nullable: true, required: false })
                    })
                }, { nullable: true, initial: null })
            })
        };
    }
}
//# sourceMappingURL=SchemaDataModel.js.map