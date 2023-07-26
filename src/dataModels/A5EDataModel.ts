/* eslint-disable no-restricted-syntax */
/** @ts-ignore */
// eslint-disable-next-line max-classes-per-file
export default class A5EDataModel extends foundry.abstract.DataModel {
  static _documentType: string;

  static _schemaTemplates: Array<any> = [];

  static _immiscible: Set<string> = new Set(['length', 'mixed', 'name', 'prototype', 'migrateData', 'defineSchema']);

  static defineSchema(): any {
    const schema = {};
    for (const template of this._schemaTemplates) {
      if (!template.defineSchema) throw new Error(`Invalid dnd5e template mixin ${template} defined on class ${this.constructor}`);
      this.mergeSchema(schema, template.defineSchema());
    }

    return schema;
  }

  static mergeSchema(schema: any, template: any): any {
    Object.assign(schema, template);
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
