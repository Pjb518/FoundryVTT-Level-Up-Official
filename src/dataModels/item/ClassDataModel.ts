import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';

export default class ClassDataModel extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      slug: new fields.StringField({ nullable: false, initial: '' }),
      description: new fields.HTMLField({ nullable: false, initial: '' }),
      hp: new fields.SchemaField({
        hitDiceSize: new fields.NumberField({
          nullable: false, initial: 6, min: 4, max: 20
        }),
        hitDiceUsed: new fields.NumberField({ nullable: false, initial: 0, min: 0 }),
        levels: new fields.SchemaField(
          Array.from({ length: 20 }, (_, i) => i + 1)
            .reduce((acc, level) => {
              acc[level] = new fields.NumberField({ nullable: false, initial: 0, min: 0 });
              return acc;
            }, {})
        )
      }),
      grants: new fields.ObjectField({
        nullable: false,
        initial: () => { }
      }),
      source: new fields.StringField({ nullable: false, initial: '' }),
      wealth: new fields.StringField({ nullable: false, initial: '' })
    });
  }
}
