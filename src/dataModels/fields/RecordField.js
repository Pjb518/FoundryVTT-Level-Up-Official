/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
export default class RecordField extends foundry.data.fields.ObjectField {
  static recursive = true;

  constructor(keyField, valueField, options) {
    super(options);

    if (!this._isValidKeyFieldType(keyField)) throw new Error('key field must be a StringField or a NumberField');
    this.keyField = keyField;

    if (!(valueField instanceof foundry.data.fields.DataField)) throw new Error(`${this.name} must have a DataField as its contained field`);
    this.valueField = valueField;
  }

  _isValidKeyFieldType(keyField) {
    if (keyField instanceof foundry.data.fields.StringField || keyField instanceof foundry.data.fields.NumberField) {
      if (keyField.options.required !== true || keyField.options.nullable === true) {
        throw new Error('key field must be required and non-nullable');
      }
      return true;
    }
    return false;
  }

  // eslint-disable-next-line consistent-return
  _validateValues(values, options = {}) {
    const ValidationFailure = foundry.data.validation.DataModelValidationFailure;
    const failures = new ValidationFailure();

    for (const [key, value] of Object.entries(values)) {
      // If this is a deletion key for a partial update, skip
      if (key.startsWith('-=') && options?.partial) continue;

      const keyFailure = this.keyField.validate(key, options);
      if (keyFailure) {
        failures.elements.push({ id: key, failure: keyFailure });
      }

      const valueFailure = this.valueField.validate(value, options);
      if (valueFailure) {
        failures.elements.push({ id: `${key}-value`, failure: valueFailure });
      }
    }

    if (failures.elements.length) {
      return failures;
    }
  }

  _cleanType(values, options = {}) {
    for (const [key, value] of Object.entries(values)) {
      values[key] = this.valueField.clean(value, options);
    }

    return values;
  }

  _validateType(values, options = {}) {
    if (!(values instanceof Object)) {
      return new foundry.data.validation.DataModelValidationFailure({ message: 'must be an Object' });
    }

    return this._validateValues(values, options);
  }

  initialize(values, model, options) {
    if (!values) return values;
    const data = {};

    for (const [key, value] of Object.entries(values)) {
      data[key] = this.valueField.initialize(value, model, options);
    }

    return data;
  }
}
