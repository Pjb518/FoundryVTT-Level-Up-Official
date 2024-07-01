import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';

export default class ArchetypeDataModel extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema() {
    // TODO: Types - Remove when types are fixed
    // @ts-ignore
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      slug: new fields.StringField({ nullable: false, initial: '' }),
      class: new fields.StringField({ nullable: false, initial: '' }),
      description: new fields.HTMLField({ nullable: false, initial: '' }),
      grants: new fields.ObjectField({ nullable: false }),
      resources: new fields.ArrayField(
        new fields.SchemaField({
          name: new fields.StringField({ nullable: false, initial: 'New Resource' }),
          reference: new fields.SchemaField(
            Array.from({ length: 20 }, (_, i) => i + 1)
              .reduce((acc, level) => {
                acc[level] = new fields.StringField({ required: true, initial: '' });
                return acc;
              }, {})
          ),
          recovery: new fields.StringField({ nullable: false, initial: 'longRest' }),
          slug: new fields.StringField({ nullable: false, initial: '' })
        }),
        { nullable: false, initial: [] }
      ),
      source: new fields.StringField({ required: true, initial: '' }),
      spellcasting: new fields.SchemaField({
        ability: new fields.SchemaField({
          base: new fields.StringField({ nullable: false, initial: 'none' }),
          options: new fields.ArrayField(
            new fields.StringField({ nullable: false, initial: 'none' }),
            { nullable: false, initial: [] }
          ),
          value: new fields.StringField({ nullable: false, initial: 'none' })
        }),
        casterType: new fields.StringField({ nullable: false, initial: 'none' })
      })
    });
  }
}
