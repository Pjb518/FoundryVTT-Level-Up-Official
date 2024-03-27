// eslint-disable-next-line max-classes-per-file
export default class A5EDataModel extends foundry.abstract.TypeDataModel {
  static _documentType: string;

  static _schemaTemplates: Array<any> = [];

  static _immiscible: Set<string> = new Set(['length', 'mixed', 'name', 'prototype', 'cleanData', '_cleanData',
    '_initializationOrder', 'validateJoint', '_validateJoint', 'migrateData', '_migrateData',
    'shimData', '_shimData', 'defineSchema']);

  /**
   * The field names of the base templates used for construction.
   * @type {Set<string>}
   * @private
   */
  static get _schemaTemplateFields() {
    const fieldNames = Object.freeze(
      new Set(this._schemaTemplates.map((t) => t.schema.keys()).flat())
    );

    Object.defineProperty(this, '_schemaTemplateFields', {
      value: fieldNames,
      writable: false,
      configurable: false
    });

    return fieldNames;
  }

  static metadata: any = Object.freeze({
    systemFlagsModel: null
  });

  get metadata() {
    return A5EDataModel.metadata;
  }

  static defineSchema(): any {
    const schema = {};
    for (const template of this._schemaTemplates) {
      if (!template.defineSchema) throw new Error(`Invalid a5e template mixin ${template} defined on class ${this.constructor}`);
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

  // static cleanData(source: Record<string, any>, options: Record<string, any> = {}) {
  //   this._cleanData(source, options);
  //   return super.cleanData(source, options);
  // }

  // static _cleanData(source: Record<string, any>, options: Record<string, any> = {}) {
  //   for (const template of this._schemaTemplates) {
  //     template._cleanData?.(source, options);
  //   }
  // }

  // eslint-disable-next-line generator-star-spacing
  static * _initializationOrder() {
    for (const template of this._schemaTemplates) {
      for (const entry of template._initializationOrder()) {
        entry[1] = this.schema.get(entry[0]);
        yield entry;
      }
    }

    for (const entry of this.schema.entries()) {
      if (this._schemaTemplateFields.has(entry[0])) continue;
      yield entry;
    }
  }

  // static validateJoint(data: Record<string, any>) {
  //   this._validateJoint(data);
  //   return super.validateJoint(data);
  // }

  // static _validateJoint(data) {
  //   for (const template of this._schemaTemplates) {
  //     template._validateJoint(data);
  //   }
  // }

  // static migrateData(source: Record<string, any>) {
  //   this._migrateData(source);
  //   return super.migrateData(source);
  // }

  // static _migrateData(source: Record<string, any>) {
  //   for (const template of this._schemaTemplates) {
  //     template._migrateData(source);
  //   }
  // }

  // static shimData(data: Record<string, any>, options: Record<string, any>) {
  //   this._shimData(data, options);
  //   return super.shimData(data, options);
  // }

  // static _shimData(data: Record<string, any>, options: Record<string, any>) {
  //   for (const template of this._schemaTemplates) {
  //     template._shimData(data, options);
  //   }
  // }

  static mixin(...templates: any[]): typeof A5EDataModel {
    const Base: typeof A5EDataModel = class extends A5EDataModel { };
    Object.defineProperty(Base, '_schemaTemplates', {
      value: Object.seal([...this._schemaTemplates, ...templates]),
      writable: false,
      configurable: false
    });

    for (const template of templates) {
      // Take all static methods and fields from template and mix in to base class
      for (const [key, value] of Object.entries(Object.getOwnPropertyDescriptors(template))) {
        if (this._immiscible.has(key)) continue;
        Object.defineProperty(Base.prototype, key, value);
      }

      // Take all instance methods and fields from template and mix in to base class
      for (const [key, descriptor] of Object.entries(
        Object.getOwnPropertyDescriptors(template.prototype)
      )) {
        if (['constructor'].includes(key)) continue;
        Object.defineProperty(Base.prototype, key, descriptor);
      }
    }

    return Base;
  }

  // @ts-ignore
  override _cleanType(data: Record<string, any>, options: any = {}) {
    options.source = options.source ?? data;

    // Clean each field that belongs to the schema
    for (const [name, field] of this.entries()) {
      if (!(name in data) && options.partial) continue;
      data[name] = field.clean(data[name], options);
      if (data[name] === undefined) delete data[name];
    }

    return data;
  }
}
