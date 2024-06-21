/* eslint-disable max-classes-per-file */

// TODO: Types - Remove when types are fixed
// @ts-ignore
class ResourceNumberData extends foundry.abstract.DataModel {
  static defineSchema() {
    // TODO: Types - Remove when types are fixed
    // @ts-ignore
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
      recovery: new fields.StringField({ required: true, initial: 'longRest' }),
      slug: new fields.StringField({ required: true, initial: '' }),
      type: new fields.StringField({ required: true, initial: '' })
    };
  }
}

// TODO: Types - Remove when types are fixed
// @ts-ignore
class ResourceDiceData extends foundry.abstract.DataModel {
  declare reference: Record<number, { number: number; faces: number; modifier: string }>;

  static defineSchema() {
    // TODO: Types - Remove when types are fixed
    // @ts-ignore
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

  static convertFromString(formula: string) {
    const [initialSeg, number, faces] = formula.match(/(\d+)?d(\d+)([+-]\d+)?/i) || [];
    const modifier = formula.replace(initialSeg || '', '');

    if (!faces || !Number.isNumeric(number) || !Number.isNumeric(faces)) return null;
    return {
      number: parseInt(number || '1', 10),
      faces: parseInt(faces, 10),
      modifier: modifier || ''
    };
  }

  getFormula(level: number) {
    const data = this.reference[level];
    if (!data) return '';

    const { number, faces } = data;
    if (!faces) return '';

    return `${number || '1'}d${this.getDie(level)}`;
  }

  getDie(level: number) {
    const data = this.reference[level];
    if (!data) return '';

    const { faces, modifier } = data;
    if (!faces) return '';

    return `${faces}${modifier || ''}`;
  }

  convertFromString(formula: string) {
    return ResourceDiceData.convertFromString(formula);
  }
}

// TODO: Types - Remove when types are fixed
// @ts-ignore
class ResourceStringData extends foundry.abstract.DataModel {
  static defineSchema() {
    // TODO: Types - Remove when types are fixed
    // @ts-ignore
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
      recovery: new fields.StringField({ required: true, initial: 'longRest' }),
      slug: new fields.StringField({ required: true, initial: '' }),
      type: new fields.StringField({ required: true, initial: '' })
    };
  }
}

// TODO: Types - Remove when types are fixed
// @ts-ignore
export default class ClassResourceField extends foundry.data.fields.ObjectField {
  getModel(type: 'number' | 'string' | 'dice') {
    if (type === 'number') return ResourceNumberData;
    if (type === 'dice') return ResourceDiceData;
    if (type === 'string') return ResourceStringData;
    return null;
  }

  initialize(value: any, model: any, options = {}) {
    const Cls = this.getModel(value.type);
    // TODO: Types - Remove when types are fixed
    // @ts-ignore
    if (Cls) return new Cls(value, { parent: model, ...options });
    return foundry.utils.deepClone(value);
  }
}
