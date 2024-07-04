import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';

interface BaseItemDataSchema {
  actions: foundry.data.fields.ObjectField<{ required: true, initial: {} }>;
  description: foundry.data.fields.HTMLField<{ required: true, initial: '' }>;
  favorite: foundry.data.fields.BooleanField<{ required: true, initial: false }>;
  secretDescription: foundry.data.fields.HTMLField<{ required: true, initial: '' }>;
  source: foundry.data.fields.StringField<{ required: true, initial: '' }>;
  uses: foundry.data.fields.SchemaField<{
    value: foundry.data.fields.NumberField<
      { required: true, initial: 0, min: 0, integer: true, nullable: false }
    >;
    max: foundry.data.fields.StringField<{ required: true, initial: '', nullable: false }>;
    per: foundry.data.fields.StringField<{ required: true, initial: '' }>;
    recharge: foundry.data.fields.SchemaField<{
      formula: foundry.data.fields.StringField<{ required: true, initial: '' }>;
      threshold: foundry.data.fields.NumberField<{ required: true, initial: 0, integer: true }>
    }>
  }>;
}

export default class BaseItemData extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      actions: new fields.ObjectField({ required: true, initial: {} }),
      description: new fields.HTMLField({ required: true, initial: '' }),
      favorite: new fields.BooleanField({ required: true, initial: false }),
      secretDescription: new fields.HTMLField({ required: true, initial: '' }),
      source: new fields.StringField({ required: true, initial: '' }),
      uses: new fields.SchemaField({
        value: new fields.NumberField({
          required: true, initial: 0, min: 0, integer: true, nullable: false
        }),
        max: new fields.StringField({ required: true, initial: '', nullable: false }),
        per: new fields.StringField({ required: true, initial: '' }),
        recharge: new fields.SchemaField({
          formula: new fields.StringField({ required: true, initial: '' }),
          threshold: new fields.NumberField({ required: true, initial: 0, integer: true })
        })
      })
    });
  }
}
