/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */

export type SimpleMerge<Target, Override> = Omit<Target, keyof Override> & Override;

declare namespace RecordField {
  type Options<IValueField> = DataFieldOptions<Record<string, BaseAssignmentType<IValueField>>>;

  type BaseAssignmentType<AssignmentElementType> =
    foundry.data.fields.ArrayField.BaseAssignmentType<AssignmentElementType>;

  type DefaultOptions<AssignmentElementType> = SimpleMerge<
    foundry.data.fields.DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: () => Record<string, AssignmentElementType>
    }
  >;

  type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  type AssignmentElementType<
    IValueField extends foundry.data.fields.DataField.Any
  > = IValueField extends foundry.data.fields.DataField<
    any, infer AssignType, any, any
  > ? AssignType : never;

  type InitializedElementType<
    IValueField extends foundry.data.fields.DataField.Any
  > = IValueField extends foundry.data.fields.DataField<
    any, any, infer InitType, any
  > ? InitType : never;

  type PersistedElementType<
    IValueField extends foundry.data.fields.DataField.Any
  > = IValueField extends foundry.data.fields.DataField<
    any, any, any, infer PersistType
  > ? PersistType : never;

  type AssignmentType<
    AET,
    Opts extends Options<AET>
  > = foundry.data.fields.DataField.DerivedAssignmentType<
    BaseAssignmentType<AET>,
    MergedOptions<AET, Opts>
  >;

  type InitializedType<
    AET,
    IET,
    Opts extends Options<AET>
  > = foundry.data.fields.DataField.DerivedInitializedType<
    Record<string, IET>,
    MergedOptions<AET, Opts>
  >;

  type PersistedType<
    AET,
    PET,
    Opts extends Options<AET>
  > = foundry.data.fields.DataField.DerivedInitializedType<
    Record<string, PET>,
    MergedOptions<AET, Opts>
  >;
}

class RecordField<
  const IKeyField extends foundry.data.fields.DataField.Any,
  const IValueField extends foundry.data.fields.DataField.Any,
  const AssignmentElementType = RecordField.AssignmentElementType<IValueField>,
  const InitializedElementType = RecordField.InitializedElementType<IValueField>,
  const PersistedElementType = RecordField.PersistedElementType<IValueField>,

  const Options extends RecordField.Options<AssignmentElementType> = RecordField.DefaultOptions<AssignmentElementType>,
  const AssignmentType = RecordField.AssignmentType<AssignmentElementType, Options>,
  const InitializedType = RecordField.InitializedType<AssignmentElementType, InitializedElementType, Options>,
  const PersistedType extends Record<string, PersistedElementType> | null | undefined = RecordField.PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Options
  >
> extends foundry.data.fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  keyField: IKeyField;

  valueField: IValueField;

  static override recursive = true;

  // TODO: Add unknown keys

  constructor(keyField: IKeyField, valueField: IValueField, options?: Options) {
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

  override _cleanType(values, options = {}): InitializedType {
    for (const [key, value] of Object.entries(values)) {
      values[key] = this.valueField.clean(value, options);
    }

    return values;
  }

  override _validateType(values, options = {}): boolean | void {
    if (!(values instanceof Object)) {
      return new foundry.data.validation.DataModelValidationFailure({ message: 'must be an Object' });
    }

    return this._validateValues(values, options);
  }

  protected override initialize(
    values: PersistedType,
    model: foundry.abstract.DataModel<any, any>,
    options: any
  ): InitializedType | (() => InitializedType | null) {
    if (!values) return {} as InitializedType;
    const data = {};

    for (const [key, value] of Object.entries(values)) {
      data[key] = this.valueField.initialize(value, model, options);
    }

    return data as InitializedType;
  }
}

export { RecordField };
