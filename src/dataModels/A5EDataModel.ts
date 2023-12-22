// eslint-disable-next-line max-classes-per-file
export default class A5EDataModel extends foundry.abstract.DataModel {
  static _documentType: string;

  static _schemaTemplates: Array<any> = [];

  static _immiscible: Set<string> = new Set(['length', 'mixed', 'name', 'prototype', 'migrateData', 'defineSchema']);

  /**
   * @override
   */
  _cleanType(data, options: any = {}) {
    options.source = options.source ?? data;

    // Clean each field that belongs to the schema
    for (const [name, field] of this.entries()) {
      if (!(name in data) && options.partial) continue;
      data[name] = field.clean(data[name], options);
      if (data[name] === undefined) delete data[name];
    }

    return data;
  }

  static defineSchema(): any {
    const schema = {};
    for (const template of this._schemaTemplates) {
      if (!template.defineSchema) throw new Error(`Invalid dnd5e template mixin ${template} defined on class ${this.constructor}`);
      this.mergeSchema(schema, template.defineSchema());
    }

    return schema;
  }

  static mergeSchema(schema: any, template: any): any {
    const { fields } = foundry.data;

    for (const key of Object.keys(template)) {
      if (!(key in schema) || (schema[key].constructor !== template[key].constructor)) {
        schema[key] = template[key];
        continue;
      }

      const mergeOptions = foundry.utils.mergeObject(schema[key].options, template[key].options);
      const fieldType = template[key].constructor;

      if (fieldType === fields.SchemaField) {
        const mergedFields = this.mergeSchema(schema[key].fields, template[key].fields);

        Object.values(mergedFields).forEach((field: any) => { field.parent = undefined; });
        schema[key] = new fields.SchemaField(mergedFields, mergeOptions);
      }

      else if (fieldType === fields.ArrayField || fieldType === fields.SetField) {
        const elemOptions = foundry.utils.mergeObject(
          schema[key].element.options,
          template[key].element.options
        );

        const ElemType = (template[key].element || schema[key].element).constructor;

        schema[key] = new template[key].constructor(new ElemType(elemOptions), mergeOptions);
      }

      else {
        schema[key] = new template[key].constructor(mergeOptions);
      }
    }

    return schema;
  }

  static mergeData(source: any) {
    for (const template of this._schemaTemplates) {
      template.migrateData?.(source);
    }
    return super.migrateData(source);
  }

  static mixin(...templates: A5EDataModel[]): A5EDataModel {
    const Base = class extends this { };
    Object.defineProperty(Base, '_schemaTemplates', {
      value: Object.seal([...this._schemaTemplates, ...templates]),
      writable: false,
      configurable: false
    });

    for (const template of templates) {
      for (const [key, value] of Object.entries(Object.getOwnPropertyDescriptors(template))) {
        // eslint-disable-next-line no-continue
        if (this._immiscible.has(key)) continue;
        Object.defineProperty(Base.prototype, key, value);
      }
    }

    return Base;
  }
}
