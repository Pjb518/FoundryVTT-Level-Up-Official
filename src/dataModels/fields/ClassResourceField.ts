/* eslint-disable max-classes-per-file */
class ResourceNumberData extends foundry.abstract.DataModel {
  static defineSchema() {
    const { fields } = foundry.data;

    return {
      name: new fields.StringField({ required: true, initial: 'New Resource' }),
      reference: new fields.SchemaField(
        Array.from({ length: 20 }, (_, i) => i + 1)
          .reduce((acc, level) => {
            acc[level] = new fields.NumberField({ nullable: false, initial: 0 });
            return acc;
          }, {})
      ),
      recovery: new fields.StringField({ required: true, initial: '' }),
      slug: new fields.StringField({ required: true, initial: '' }),
      type: new fields.StringField({ required: true, initial: '' })
    };
  }
}

class ResourceDiceData extends foundry.abstract.DataModel {
  static defineSchema() {
    const { fields } = foundry.data;

    return {
      name: new fields.StringField({ required: true, initial: 'New Resource' }),
      reference: new fields.SchemaField(
        Array.from({ length: 20 }, (_, i) => i + 1)
          .reduce((acc, level) => {
            acc[level] = new fields.SchemaField({
              number: new fields.NumberField({ integer: true, positive: true, nullable: true }),
              faces: new fields.NumberField({ integer: true, positive: true, nullable: true }),
              modifier: new fields.StringField({ nullable: true, initial: '' })
            });
            return acc;
          }, {})
      ),
      slug: new fields.StringField({ required: true, initial: '' }),
      type: new fields.StringField({ required: true, initial: '' })
    };
  }

  static FACES = [2, 3, 4, 6, 8, 10, 12, 20, 100];
}

class ResourceStringData extends foundry.abstract.DataModel {
  static defineSchema() {
    const { fields } = foundry.data;

    return {
      name: new fields.StringField({ required: true, initial: 'New Resource' }),
      reference: new fields.SchemaField(
        Array.from({ length: 20 }, (_, i) => i + 1)
          .reduce((acc, level) => {
            acc[level] = new fields.StringField({ required: true, initial: '' });
            return acc;
          }, {})
      ),
      recovery: new fields.StringField({ required: true, initial: '' }),
      slug: new fields.StringField({ required: true, initial: '' }),
      type: new fields.StringField({ required: true, initial: '' })
    };
  }
}

export default class ClassResourceField extends foundry.data.fields.ObjectField {
  getModel(type: 'number' | 'string' | 'dice') {
    if (type === 'number') return ResourceNumberData;
    if (type === 'dice') return ResourceDiceData;
    if (type === 'string') return ResourceStringData;
    return null;
  }

  initialize(value: any, model: any, options = {}) {
    console.log(value.type);
    const Cls = this.getModel(value.type);
    if (Cls) return new Cls(value, { parent: model, ...options });
    return foundry.utils.deepClone(value);
  }
}
