/**
 * A Custom DataField validator function.
 *
 * A boolean return value indicates that the value is valid (true) or invalid (false) with certainty. With an explicit
 * boolean return value no further validation functions will be evaluated.
 *
 * An undefined return indicates that the value may be valid but further validation functions should be performed,
 * if defined.
 *
 * An Error may be thrown which provides a custom error message explaining the reason the value is invalid.
 */
export type DataFieldValidator = (value: any, options: DataFieldValidationOptions) => boolean | void;
export type DataFieldOptions = {
    /**
     * Is this field required to be populated?
     */
    required?: boolean;
    /**
     * Can this field have null values?
     */
    nullable?: boolean;
    /**
     * Can this field only be modified by a gamemaster or assistant gamemaster?
     */
    gmOnly?: boolean;
    /**
     * The initial value of a field, or a function which assigns that initial value.
     */
    initial?: Function | any;
    /**
     * A localizable label displayed on forms which render this field.
     */
    label?: string;
    /**
     * Localizable help text displayed on forms which render this field.
     */
    hint?: string;
    /**
     * A custom data field validation function.
     */
    validate?: DataFieldValidator;
    /**
     * A custom validation error string. When displayed will be prepended with the
     *    document name, field name, and candidate value. This error string is only
     *    used when the return type of the validate function is a boolean. If an Error
     *    is thrown in the validate function, the string message of that Error is used.
     */
    validationError?: string;
};
export type DataFieldContext = {
    /**
     * A field name to assign to the constructed field
     */
    name?: string;
    /**
     * Another data field which is a hierarchical parent of this one
     */
    parent?: DataField;
};
export type DataFieldValidationOptions = {
    /**
     * Whether this is a partial schema validation, or a complete one.
     */
    partial?: boolean;
    /**
     * Whether to allow replacing invalid values with valid fallbacks.
     */
    fallback?: boolean;
    /**
     * The full source object being evaluated.
     */
    source?: object;
    /**
     * If true, invalid embedded documents will emit a warning and be placed in
     *   the invalidDocuments collection rather than causing the parent to be
     *   considered invalid.
     */
    dropInvalidEmbedded?: boolean;
};
export type NumberFieldOptions = DataFieldOptions;
export type StringFieldParams = {
    /**
     * Is the string allowed to be blank (empty)?
     */
    blank?: boolean;
    /**
     * Should any provided string be trimmed as part of cleaning?
     */
    trim?: boolean;
    /**
     * An array of values or an object of values/labels which represent
     * allowed choices for the field. A function may be provided which dynamically
     * returns the array of choices.
     */
    choices?: string[] | object | Function;
    /**
     * Is this string field a target for text search?
     */
    textSearch?: boolean;
};
export type StringFieldOptions = DataFieldOptions & StringFieldParams;
export type ArrayFieldOptions = DataFieldOptions;
export type DocumentUUIDFieldOptions = {
    /**
     * A specific document type in CONST.ALL_DOCUMENT_TYPES required by this field
     */
    type?: string;
    /**
     * Does this field require (or prohibit) embedded documents?
     */
    embedded?: boolean;
};
export type FilePathFieldOptions = StringFieldOptions;
export type DocumentStats = {
    /**
     * The core version whose schema the Document data is in.
     * It is NOT the version the Document was created or last modified in.
     */
    coreVersion: string | null;
    /**
     * The package name of the system the Document was created in.
     */
    systemId: string | null;
    /**
     * The version of the system the Document was created or last modified in.
     */
    systemVersion: string | null;
    /**
     * A timestamp of when the Document was created.
     */
    createdTime: number | null;
    /**
     * A timestamp of when the Document was last modified.
     */
    modifiedTime: number | null;
    /**
     * The ID of the user who last modified the Document.
     */
    lastModifiedBy: string | null;
    /**
     * The UUID of the compendium Document this one was imported from.
     */
    compendiumSource: string | null;
    /**
     * The UUID of the Document this one is a duplicate of.
     */
    duplicateSource: string | null;
};
export type JavaScriptFieldOptions = {
    /**
     * Does the field allow async code?
     */
    async?: boolean;
};
/**
 * A special [NumberField]{@link NumberField} represents a number between 0 and 1.
 */
export class AlphaField extends NumberField {
}
/**
 * A special {@link NumberField} which represents an angle of rotation in degrees between 0 and 360.
 * @property {boolean} normalize    Whether the angle should be normalized to [0,360) before being clamped to [0,360]. The default is true.
 */
export class AngleField extends NumberField {
    constructor(options?: {}, context?: {});
    /**
     * @deprecated since v12
     * @ignore
     */
    set base(v: number);
    /**
     * @deprecated since v12
     * @ignore
     */
    get base(): number;
    /** @inheritdoc */
    _cast(value: any): any;
    #private;
}
/**
 * A special subclass of {@link DataField} which can contain any value of any type.
 * Any input is accepted and is treated as valid.
 * It is not recommended to use this class except for very specific circumstances.
 */
export class AnyField extends DataField {
    /** @override */
    override _cast(value: any): any;
    /** @override */
    override _validateType(value: any): boolean;
}
/**
 * @typedef {DataFieldOptions} ArrayFieldOptions
 * @property {number} [min]          The minimum number of elements.
 * @property {number} [max]          The maximum number of elements.
 */
/**
 * A subclass of [DataField]{@link DataField} which deals with array-typed data.
 * @property {number} min     The minimum number of elements.
 * @property {number} max     The maximum number of elements.
 */
export class ArrayField extends DataField {
    /** @inheritdoc */
    static get _defaults(): any;
    /**
     * Validate the contained element type of the ArrayField
     * @param {*} element       The type of Array element
     * @returns {*}             The validated element type
     * @throws                  An error if the element is not a valid type
     * @protected
     */
    protected static _validateElementType(element: any): any;
    /**
     * @param {DataField} element            A DataField instance which defines the type of element contained in the Array
     * @param {ArrayFieldOptions} [options]  Options which configure the behavior of the field
     * @param {DataFieldContext} [context]   Additional context which describes the field
     */
    constructor(element: DataField, options?: ArrayFieldOptions, context?: DataFieldContext);
    /**
     * The data type of each element in this array
     * @type {DataField}
     */
    element: DataField;
    /** @override */
    override _validateModel(changes: any, options: any): void;
    /** @override */
    override _cast(value: any): any[];
    /** @override */
    override _cleanType(value: any, options: any): any;
    /** @override */
    override _validateType(value: any, options?: {}): void | DataModelValidationFailure;
    /**
     * Validate every element of the ArrayField
     * @param {Array} value                         The array to validate
     * @param {DataFieldValidationOptions} options  Validation options
     * @returns {DataModelValidationFailure|void}   A validation failure if any of the elements failed validation,
     *                                              otherwise void.
     * @protected
     */
    protected _validateElements(value: any[], options: DataFieldValidationOptions): DataModelValidationFailure | void;
    /**
     * Validate a single element of the ArrayField.
     * @param {*} value                       The value of the array element
     * @param {DataFieldValidationOptions} options  Validation options
     * @returns {DataModelValidationFailure}  A validation failure if the element failed validation
     * @protected
     */
    protected _validateElement(value: any, options: DataFieldValidationOptions): DataModelValidationFailure;
    /** @override */
    override initialize(value: any, model: any, options?: {}): any;
    /** @override */
    override toObject(value: any): any;
    /** @override */
    override apply(fn: any, value?: any[], options?: {}): any[];
    /** @override */
    override _getField(path: any): DataField | this;
    /**
     * Migrate this field's candidate source data.
     * @param {object} sourceData   Candidate source data of the root model
     * @param {any} fieldData       The value of this field within the source data
     */
    migrateSource(sourceData: object, fieldData: any): void;
    /** @override */
    override _castChangeDelta(raw: any): any[];
    /** @override */
    override _applyChangeAdd(value: any, delta: any, model: any, change: any): any;
}
/**
 * A subclass of [DataField]{@link DataField} which deals with boolean-typed data.
 */
export class BooleanField extends DataField {
    /** @inheritdoc */
    static get _defaults(): any;
    /** @override */
    override _cast(value: any): boolean;
    /** @override */
    override _validateType(value: any): void;
    /** @override */
    override _toInput(config: any): any;
    /** @override */
    override _applyChangeAdd(value: any, delta: any, model: any, change: any): any;
    /** @override */
    override _applyChangeMultiply(value: any, delta: any, model: any, change: any): any;
    /** @override */
    override _applyChangeUpgrade(value: any, delta: any, model: any, change: any): any;
    _applyChangeDowngrade(value: any, delta: any, model: any, change: any): any;
}
/**
 * A special [StringField]{@link StringField} which records a standardized CSS color string.
 */
export class ColorField extends StringField {
    /** @override */
    override initialize(value: any, model: any, options?: {}): any;
    /** @override */
    override getInitialValue(data: any): any;
    /** @override */
    override _cast(value: any): any;
    /** @override */
    override _cleanType(value: any, options: any): any;
    /** @inheritdoc */
    _validateType(value: any, options: any): boolean;
}
/**
 * @callback DataFieldValidator
 * A Custom DataField validator function.
 *
 * A boolean return value indicates that the value is valid (true) or invalid (false) with certainty. With an explicit
 * boolean return value no further validation functions will be evaluated.
 *
 * An undefined return indicates that the value may be valid but further validation functions should be performed,
 * if defined.
 *
 * An Error may be thrown which provides a custom error message explaining the reason the value is invalid.
 *
 * @param {any} value                     The value provided for validation
 * @param {DataFieldValidationOptions} options  Validation options
 * @returns {boolean|void}
 * @throws {Error}
 */
/**
 * @typedef {Object} DataFieldOptions
 * @property {boolean} [required=false]   Is this field required to be populated?
 * @property {boolean} [nullable=false]   Can this field have null values?
 * @property {boolean} [gmOnly=false]     Can this field only be modified by a gamemaster or assistant gamemaster?
 * @property {Function|*} [initial]       The initial value of a field, or a function which assigns that initial value.
 * @property {string} [label]             A localizable label displayed on forms which render this field.
 * @property {string} [hint]              Localizable help text displayed on forms which render this field.
 * @property {DataFieldValidator} [validate] A custom data field validation function.
 * @property {string} [validationError]   A custom validation error string. When displayed will be prepended with the
 *                                        document name, field name, and candidate value. This error string is only
 *                                        used when the return type of the validate function is a boolean. If an Error
 *                                        is thrown in the validate function, the string message of that Error is used.
 */
/**
 * @typedef {Object} DataFieldContext
 * @property {string} [name]               A field name to assign to the constructed field
 * @property {DataField} [parent]          Another data field which is a hierarchical parent of this one
 */
/**
 * @typedef {object} DataFieldValidationOptions
 * @property {boolean} [partial]   Whether this is a partial schema validation, or a complete one.
 * @property {boolean} [fallback]  Whether to allow replacing invalid values with valid fallbacks.
 * @property {object} [source]     The full source object being evaluated.
 * @property {boolean} [dropInvalidEmbedded]  If true, invalid embedded documents will emit a warning and be placed in
 *                                            the invalidDocuments collection rather than causing the parent to be
 *                                            considered invalid.
 */
/**
 * An abstract class that defines the base pattern for a data field within a data schema.
 * @abstract
 * @property {string} name                The name of this data field within the schema that contains it.
 * @mixes DataFieldOptions
 */
export class DataField {
    /**
     * Whether this field defines part of a Document/Embedded Document hierarchy.
     * @type {boolean}
     */
    static hierarchical: boolean;
    /**
     * Does this field type contain other fields in a recursive structure?
     * Examples of recursive fields are SchemaField, ArrayField, or TypeDataField
     * Examples of non-recursive fields are StringField, NumberField, or ObjectField
     * @type {boolean}
     */
    static recursive: boolean;
    /**
     * Default parameters for this field type
     * @return {DataFieldOptions}
     * @protected
     */
    protected static get _defaults(): DataFieldOptions;
    /**
     * Does this form field class have defined form support?
     * @type {boolean}
     */
    static get hasFormSupport(): boolean;
    /**
     * @param {DataFieldOptions} [options]    Options which configure the behavior of the field
     * @param {DataFieldContext} [context]    Additional context which describes the field
     */
    constructor(options?: DataFieldOptions, { name, parent }?: DataFieldContext);
    /**
     * The field name of this DataField instance.
     * This is assigned by SchemaField#initialize.
     * @internal
     */
    name: string;
    /**
     * A reference to the parent schema to which this DataField belongs.
     * This is assigned by SchemaField#initialize.
     * @internal
     */
    parent: DataField;
    /**
     * The initially provided options which configure the data field
     * @type {DataFieldOptions}
     */
    options: DataFieldOptions;
    /**
     * A dot-separated string representation of the field path within the parent schema.
     * @type {string}
     */
    get fieldPath(): string;
    /**
     * Apply a function to this DataField which propagates through recursively to any contained data schema.
     * @param {string|function} fn          The function to apply
     * @param {*} value                     The current value of this field
     * @param {object} [options={}]         Additional options passed to the applied function
     * @returns {object}                    The results object
     */
    apply(fn: string | Function, value: any, options?: object): object;
    /**
     * Coerce source data to ensure that it conforms to the correct data type for the field.
     * Data coercion operations should be simple and synchronous as these are applied whenever a DataModel is constructed.
     * For one-off cleaning of user-provided input the sanitize method should be used.
     * @param {*} value           The initial value
     * @param {object} [options]  Additional options for how the field is cleaned
     * @param {boolean} [options.partial]   Whether to perform partial cleaning?
     * @param {object} [options.source]     The root data model being cleaned
     * @returns {*}               The cast value
     */
    clean(value: any, options?: {
        partial?: boolean;
        source?: object;
    }): any;
    /**
     * Apply any cleaning logic specific to this DataField type.
     * @param {*} value           The appropriately coerced value.
     * @param {object} [options]  Additional options for how the field is cleaned.
     * @returns {*}               The cleaned value.
     * @protected
     */
    protected _cleanType(value: any, options?: object): any;
    /**
     * Cast a non-default value to ensure it is the correct type for the field
     * @param {*} value       The provided non-default value
     * @returns {*}           The standardized value
     * @protected
     */
    protected _cast(value: any): any;
    /**
     * Attempt to retrieve a valid initial value for the DataField.
     * @param {object} data   The source data object for which an initial value is required
     * @returns {*}           A valid initial value
     * @throws                An error if there is no valid initial value defined
     */
    getInitialValue(data: object): any;
    /**
     * Validate a candidate input for this field, ensuring it meets the field requirements.
     * A validation failure can be provided as a raised Error (with a string message), by returning false, or by returning
     * a DataModelValidationFailure instance.
     * A validator which returns true denotes that the result is certainly valid and further validations are unnecessary.
     * @param {*} value                                  The initial value
     * @param {DataFieldValidationOptions} [options={}]  Options which affect validation behavior
     * @returns {DataModelValidationFailure}             Returns a DataModelValidationFailure if a validation failure
     *                                                   occurred.
     */
    validate(value: any, options?: DataFieldValidationOptions): DataModelValidationFailure;
    /**
     * Special validation rules which supersede regular field validation.
     * This validator screens for certain values which are otherwise incompatible with this field like null or undefined.
     * @param {*} value               The candidate value
     * @returns {boolean|void}        A boolean to indicate with certainty whether the value is valid.
     *                                Otherwise, return void.
     * @throws                        May throw a specific error if the value is not valid
     * @protected
     */
    protected _validateSpecial(value: any): boolean | void;
    /**
     * A default type-specific validator that can be overridden by child classes
     * @param {*} value                                    The candidate value
     * @param {DataFieldValidationOptions} [options={}]    Options which affect validation behavior
     * @returns {boolean|DataModelValidationFailure|void}  A boolean to indicate with certainty whether the value is
     *                                                     valid, or specific DataModelValidationFailure information,
     *                                                     otherwise void.
     * @throws                                             May throw a specific error if the value is not valid
     * @protected
     */
    protected _validateType(value: any, options?: DataFieldValidationOptions): boolean | DataModelValidationFailure | void;
    /**
     * Certain fields may declare joint data validation criteria.
     * This method will only be called if the field is designated as recursive.
     * @param {object} data       Candidate data for joint model validation
     * @param {object} options    Options which modify joint model validation
     * @throws  An error if joint model validation fails
     * @internal
     */
    _validateModel(data: object, options?: object): void;
    /**
     * Initialize the original source data into a mutable copy for the DataModel instance.
     * @param {*} value                   The source value of the field
     * @param {Object} model              The DataModel instance that this field belongs to
     * @param {object} [options]          Initialization options
     * @returns {*}                       An initialized copy of the source data
     */
    initialize(value: any, model: any, options?: object): any;
    /**
     * Export the current value of the field into a serializable object.
     * @param {*} value                   The initialized value of the field
     * @returns {*}                       An exported representation of the field
     */
    toObject(value: any): any;
    /**
     * Recursively traverse a schema and retrieve a field specification by a given path
     * @param {string[]} path             The field path as an array of strings
     * @protected
     */
    protected _getField(path: string[]): this;
    /**
     * Render this DataField as an HTML element.
     * @param {FormInputConfig} config        Form element configuration parameters
     * @throws {Error}                        An Error if this DataField subclass does not support input rendering
     * @returns {HTMLElement|HTMLCollection}  A rendered HTMLElement for the field
     */
    toInput(config?: FormInputConfig): HTMLElement | HTMLCollection;
    /**
     * Render this DataField as an HTML element.
     * Subclasses should implement this method rather than the public toInput method which wraps it.
     * @param {FormInputConfig} config        Form element configuration parameters
     * @throws {Error}                        An Error if this DataField subclass does not support input rendering
     * @returns {HTMLElement|HTMLCollection}  A rendered HTMLElement for the field
     * @protected
     */
    protected _toInput(config: FormInputConfig): HTMLElement | HTMLCollection;
    /**
     * Render this DataField as a standardized form-group element.
     * @param {FormGroupConfig} groupConfig   Configuration options passed to the wrapping form-group
     * @param {FormInputConfig} inputConfig   Input element configuration options passed to DataField#toInput
     * @returns {HTMLDivElement}              The rendered form group element
     */
    toFormGroup(groupConfig?: FormGroupConfig, inputConfig?: FormInputConfig): HTMLDivElement;
    /**
     * Apply an ActiveEffectChange to this field.
     * @param {*} value                  The field's current value.
     * @param {DataModel} model          The model instance.
     * @param {EffectChangeData} change  The change to apply.
     * @returns {*}                      The updated value.
     */
    applyChange(value: any, model: DataModel, change: EffectChangeData): any;
    /**
     * Cast a change delta into an appropriate type to be applied to this field.
     * @param {*} delta  The change delta.
     * @returns {*}
     * @internal
     */
    _castChangeDelta(delta: any): any;
    /**
     * Apply an ADD change to this field.
     * @param {*} value                  The field's current value.
     * @param {*} delta                  The change delta.
     * @param {DataModel} model          The model instance.
     * @param {EffectChangeData} change  The original change data.
     * @returns {*}                      The updated value.
     * @protected
     */
    protected _applyChangeAdd(value: any, delta: any, model: DataModel, change: EffectChangeData): any;
    /**
     * Apply a MULTIPLY change to this field.
     * @param {*} value                  The field's current value.
     * @param {*} delta                  The change delta.
     * @param {DataModel} model          The model instance.
     * @param {EffectChangeData} change  The original change data.
     * @returns {*}                      The updated value.
     * @protected
     */
    protected _applyChangeMultiply(value: any, delta: any, model: DataModel, change: EffectChangeData): any;
    /**
     * Apply an OVERRIDE change to this field.
     * @param {*} value                  The field's current value.
     * @param {*} delta                  The change delta.
     * @param {DataModel} model          The model instance.
     * @param {EffectChangeData} change  The original change data.
     * @returns {*}                      The updated value.
     * @protected
     */
    protected _applyChangeOverride(value: any, delta: any, model: DataModel, change: EffectChangeData): any;
    /**
     * Apply an UPGRADE change to this field.
     * @param {*} value                  The field's current value.
     * @param {*} delta                  The change delta.
     * @param {DataModel} model          The model instance.
     * @param {EffectChangeData} change  The original change data.
     * @returns {*}                      The updated value.
     * @protected
     */
    protected _applyChangeUpgrade(value: any, delta: any, model: DataModel, change: EffectChangeData): any;
    /**
     * Apply a DOWNGRADE change to this field.
     * @param {*} value                  The field's current value.
     * @param {*} delta                  The change delta.
     * @param {DataModel} model          The model instance.
     * @param {EffectChangeData} change  The original change data.
     * @returns {*}                      The updated value.
     * @protected
     */
    protected _applyChangeDowngrade(value: any, delta: any, model: DataModel, change: EffectChangeData): any;
    /**
     * Apply a CUSTOM change to this field.
     * @param {*} value                  The field's current value.
     * @param {*} delta                  The change delta.
     * @param {DataModel} model          The model instance.
     * @param {EffectChangeData} change  The original change data.
     * @returns {*}                      The updated value.
     * @protected
     */
    protected _applyChangeCustom(value: any, delta: any, model: DataModel, change: EffectChangeData): any;
}
/**
 * A subclass of [StringField]{@link StringField} which provides the primary _id for a Document.
 * The field may be initially null, but it must be non-null when it is saved to the database.
 */
export class DocumentIdField extends StringField {
    /** @override */
    override _cast(value: any): any;
    /** @override */
    override _validateType(value: any): void;
}
/**
 * A special [ObjectField]{@link ObjectField} which captures a mapping of User IDs to Document permission levels.
 */
export class DocumentOwnershipField extends ObjectField {
    /** @override */
    override _validateType(value: any): boolean;
}
/**
 * @typedef {Object} DocumentStats
 * @property {string|null} coreVersion       The core version whose schema the Document data is in.
 *                                           It is NOT the version the Document was created or last modified in.
 * @property {string|null} systemId          The package name of the system the Document was created in.
 * @property {string|null} systemVersion     The version of the system the Document was created or last modified in.
 * @property {number|null} createdTime       A timestamp of when the Document was created.
 * @property {number|null} modifiedTime      A timestamp of when the Document was last modified.
 * @property {string|null} lastModifiedBy    The ID of the user who last modified the Document.
 * @property {string|null} compendiumSource  The UUID of the compendium Document this one was imported from.
 * @property {string|null} duplicateSource   The UUID of the Document this one is a duplicate of.
 */
/**
 * A subclass of {@link SchemaField} which stores document metadata in the _stats field.
 * @mixes DocumentStats
 */
export class DocumentStatsField extends SchemaField {
    /**
     * All Document stats.
     * @type {string[]}
     */
    static fields: string[];
    /**
     * These fields are managed by the server and are ignored if they appear in creation or update data.
     * @type {string[]}
     */
    static managedFields: string[];
    /**
     * @param {DataFieldOptions} [options]        Options which configure the behavior of the field
     * @param {DataFieldContext} [context]        Additional context which describes the field
     */
    constructor(options?: DataFieldOptions, context?: DataFieldContext);
}
/**
 * A subclass of [StringField]{@link StringField} that is used specifically for the Document "type" field.
 */
export class DocumentTypeField extends StringField {
    /**
     * @param {typeof foundry.abstract.Document} documentClass  The base document class which belongs in this field
     * @param {StringFieldOptions} [options]  Options which configure the behavior of the field
     * @param {DataFieldContext} [context]    Additional context which describes the field
     */
    constructor(documentClass: typeof foundry.abstract.Document, options?: StringFieldOptions, context?: DataFieldContext);
    /** @override */
    override _validateType(value: any, options: any): boolean;
}
/**
 * @typedef {Object} DocumentUUIDFieldOptions
 * @property {string} [type]            A specific document type in CONST.ALL_DOCUMENT_TYPES required by this field
 * @property {boolean} [embedded]       Does this field require (or prohibit) embedded documents?
 */
/**
 * A subclass of {@link StringField} which supports referencing some other Document by its UUID.
 * This field may not be blank, but may be null to indicate that no UUID is referenced.
 */
export class DocumentUUIDField extends StringField {
    /**
     * @param {StringFieldOptions & DocumentUUIDFieldOptions} [options] Options which configure the behavior of the field
     * @param {DataFieldContext} [context]    Additional context which describes the field
     */
    constructor(options?: StringFieldOptions & DocumentUUIDFieldOptions, context?: DataFieldContext);
    /** @override */
    override _validateType(value: any): void;
}
/**
 * A subclass of [ObjectField]{@link ObjectField} which embeds some other DataModel definition as an inner object.
 */
export class EmbeddedDataField extends SchemaField {
    /**
     * @param {typeof DataModel} model          The class of DataModel which should be embedded in this field
     * @param {DataFieldOptions} [options]      Options which configure the behavior of the field
     * @param {DataFieldContext} [context]      Additional context which describes the field
     */
    constructor(model: typeof DataModel, options?: DataFieldOptions, context?: DataFieldContext);
    /**
     * The embedded DataModel definition which is contained in this field.
     * @type {typeof DataModel}
     */
    model: typeof DataModel;
    /** @inheritdoc */
    clean(value: any, options: any): any;
    /** @inheritdoc */
    validate(value: any, options: any): DataModelValidationFailure;
    /** @override */
    override migrateSource(sourceData: any, fieldData: any): void;
    /** @override */
    override _validateModel(changes: any, options: any): void;
}
/**
 * A subclass of [ArrayField]{@link ArrayField} which supports an embedded Document collection.
 * Invalid elements will be dropped from the collection during validation rather than failing for the field entirely.
 */
export class EmbeddedCollectionField extends ArrayField {
    /** @override */
    static override _validateElementType(element: any): any;
    /**
     * The Collection implementation to use when initializing the collection.
     * @type {typeof EmbeddedCollection}
     */
    static get implementation(): typeof EmbeddedCollection;
    /**
     * @param {typeof foundry.abstract.Document} element  The type of Document which belongs to this embedded collection
     * @param {DataFieldOptions} [options]  Options which configure the behavior of the field
     * @param {DataFieldContext} [context]  Additional context which describes the field
     */
    constructor(element: typeof foundry.abstract.Document, options?: DataFieldOptions, context?: DataFieldContext);
    readonly: boolean;
    /**
     * A reference to the DataModel subclass of the embedded document element
     * @type {typeof foundry.abstract.Document}
     */
    get model(): typeof import("../abstract/document.mjs").default;
    /**
     * The DataSchema of the contained Document model.
     * @type {SchemaField}
     */
    get schema(): SchemaField;
    /** @override */
    override _validateElements(value: any, options: any): DataModelValidationFailure;
    /** @override */
    override apply(fn: any, value?: any[], options?: {}): {}[];
    /**
     * Return the embedded document(s) as a Collection.
     * @param {foundry.abstract.Document} parent  The parent document.
     * @returns {DocumentCollection}
     */
    getCollection(parent: foundry.abstract.Document): DocumentCollection;
}
/**
 * A subclass of {@link EmbeddedCollectionField} which manages a collection of delta objects relative to another
 * collection.
 */
export class EmbeddedCollectionDeltaField extends EmbeddedCollectionField {
    /** @override */
    static override get implementation(): typeof EmbeddedCollectionDelta;
}
/**
 * A subclass of {@link EmbeddedDataField} which supports a single embedded Document.
 */
export class EmbeddedDocumentField extends EmbeddedDataField {
    /**
     * @param {typeof foundry.abstract.Document} model The type of Document which is embedded.
     * @param {DataFieldOptions} [options]  Options which configure the behavior of the field.
     * @param {DataFieldContext} [context]  Additional context which describes the field
     */
    constructor(model: typeof foundry.abstract.Document, options?: DataFieldOptions, context?: DataFieldContext);
    /**
     * Return the embedded document(s) as a Collection.
     * @param {Document} parent  The parent document.
     * @returns {Collection<Document>}
     */
    getCollection(parent: Document): Collection<Document>;
}
/**
 * @typedef {StringFieldOptions} FilePathFieldOptions
 * @property {string[]} [categories]    A set of categories in CONST.FILE_CATEGORIES which this field supports
 * @property {boolean} [base64=false]   Is embedded base64 data supported in lieu of a file path?
 * @property {boolean} [wildcard=false] Does this file path field allow wildcard characters?
 * @property {object} [initial]         The initial values of the fields
 */
/**
 * A special [StringField]{@link StringField} which records a file path or inline base64 data.
 * @property {string[]} categories      A set of categories in CONST.FILE_CATEGORIES which this field supports
 * @property {boolean} base64=false     Is embedded base64 data supported in lieu of a file path?
 * @property {boolean} wildcard=false   Does this file path field allow wildcard characters?
 */
export class FilePathField extends StringField {
}
/**
 * A special class of [StringField]{@link StringField} field which references another DataModel by its id.
 * This field may also be null to indicate that no foreign model is linked.
 */
export class ForeignDocumentField extends DocumentIdField {
    /**
     * @param {typeof foundry.abstract.Document} model  The foreign DataModel class definition which this field links to
     * @param {StringFieldOptions} [options]    Options which configure the behavior of the field
     * @param {DataFieldContext} [context]      Additional context which describes the field
     */
    constructor(model: typeof foundry.abstract.Document, options?: StringFieldOptions, context?: DataFieldContext);
    /**
     * A reference to the model class which is stored in this field
     * @type {typeof foundry.abstract.Document}
     */
    model: typeof foundry.abstract.Document;
    /** @inheritdoc */
    initialize(value: any, model: any, options?: {}): any;
    /** @inheritdoc */
    toObject(value: any): any;
}
/**
 * A subclass of [StringField]{@link StringField} which contains a sanitized HTML string.
 * This class does not override any StringField behaviors, but is used by the server-side to identify fields which
 * require sanitization of user input.
 */
export class HTMLField extends StringField {
    /** @override */
    override toFormGroup(groupConfig: {}, inputConfig: any): HTMLDivElement;
}
/**
 * A special [NumberField]{@link NumberField} represents a number between 0 (inclusive) and 1 (exclusive).
 * Its values are normalized (modulo 1) to the range [0, 1) instead of being clamped.
 */
export class HueField extends NumberField {
    /** @inheritdoc */
    _cast(value: any): any;
}
/**
 * A subclass of {@link NumberField} which is used for storing integer sort keys.
 */
export class IntegerSortField extends NumberField {
}
/**
 * @typedef {Object} JavaScriptFieldOptions
 * @property {boolean} [async=false]            Does the field allow async code?
 */
/**
 * A subclass of {@link StringField} which contains JavaScript code.
 */
export class JavaScriptField extends StringField {
    /**
     * @param {StringFieldOptions & JavaScriptFieldOptions} [options] Options which configure the behavior of the field
     * @param {DataFieldContext} [context]    Additional context which describes the field
     */
    constructor(options?: StringFieldOptions & JavaScriptFieldOptions, context?: DataFieldContext);
    choices: any;
    /** @inheritdoc */
    _validateType(value: any, options: any): boolean;
    /** @override */
    override toFormGroup(groupConfig: {}, inputConfig: any): HTMLDivElement;
}
/**
 * A special [StringField]{@link StringField} which contains serialized JSON data.
 */
export class JSONField extends StringField {
    constructor(options: any, context: any);
    trim: boolean;
    choices: any;
    /** @override */
    override _validateType(value: any, options: any): void;
    /** @override */
    override initialize(value: any, model: any, options?: {}): any;
    /** @override */
    override toObject(value: any): any;
}
/**
 * @typedef {DataFieldOptions} NumberFieldOptions
 * @property {number} [min]               A minimum allowed value
 * @property {number} [max]               A maximum allowed value
 * @property {number} [step]              A permitted step size
 * @property {boolean} [integer=false]    Must the number be an integer?
 * @property {number} [positive=false]    Must the number be positive?
 * @property {number[]|object|function} [choices]  An array of values or an object of values/labels which represent
 *                                        allowed choices for the field. A function may be provided which dynamically
 *                                        returns the array of choices.
 */
/**
 * A subclass of [DataField]{@link DataField} which deals with number-typed data.
 *
 * @property {number} min                 A minimum allowed value
 * @property {number} max                 A maximum allowed value
 * @property {number} step                A permitted step size
 * @property {boolean} integer=false      Must the number be an integer?
 * @property {number} positive=false      Must the number be positive?
 * @property {number[]|object|function} [choices]  An array of values or an object of values/labels which represent
 *                                        allowed choices for the field. A function may be provided which dynamically
 *                                        returns the array of choices.
 */
export class NumberField extends DataField {
    /** @inheritdoc */
    static get _defaults(): any;
    nullable: boolean;
    /** @override */
    override _cast(value: any): number;
    /** @inheritdoc */
    _cleanType(value: any, options: any): any;
    /** @override */
    override _validateType(value: any): void;
    /** @override */
    override _toInput(config: any): any;
    /** @override */
    override _applyChangeMultiply(value: any, delta: any, model: any, change: any): number;
    /** @override */
    override _applyChangeUpgrade(value: any, delta: any, model: any, change: any): any;
    /** @override */
    override _applyChangeDowngrade(value: any, delta: any, model: any, change: any): any;
    #private;
}
/**
 * A subclass of [DataField]{@link DataField} which deals with object-typed data.
 */
export class ObjectField extends DataField {
    /** @inheritdoc */
    static get _defaults(): any;
    /** @override */
    override _cast(value: any): any;
    /** @override */
    override initialize(value: any, model: any, options?: {}): any;
    /** @override */
    override toObject(value: any): any;
    /** @override */
    override _validateType(value: any, options?: {}): void;
}
/**
 * A subclass of [DataField]{@link DataField} which allows to typed schemas.
 */
export class TypedSchemaField extends DataField {
    /** @inheritdoc */
    static get _defaults(): any;
    /**
     * @param {{[type: string]: DataSchema|SchemaField|typeof DataModel}} types    The different types this field can represent.
     * @param {DataFieldOptions} [options]                                         Options which configure the behavior of the field
     * @param {DataFieldContext} [context]                                         Additional context which describes the field
     */
    constructor(types: {
        [type: string]: DataSchema | SchemaField | typeof DataModel;
    }, options?: DataFieldOptions, context?: DataFieldContext);
    /**
    * The types of this field.
    * @type {{[type: string]: SchemaField}}
    */
    types: {
        [type: string]: SchemaField;
    };
    /** @override */
    override _getField(path: any): SchemaField | DataField | this;
    /** @override */
    override _cleanType(value: any, options: any): any;
    /** @override */
    override _cast(value: any): any;
    /** @override */
    override _validateSpecial(value: any): boolean | void;
    /** @override */
    override _validateType(value: any, options: any): DataModelValidationFailure;
    /** @override */
    override initialize(value: any, model: any, options: any): any;
    /** @override */
    override toObject(value: any): any;
    /** @override */
    override apply(fn: any, data: any, options: any): {};
    /**
     * Migrate this field's candidate source data.
     * @param {object} sourceData   Candidate source data of the root model
     * @param {any} fieldData       The value of this field within the source data
     */
    migrateSource(sourceData: object, fieldData: any): void;
    #private;
}
/**
 * A special class of {@link DataField} which defines a data schema.
 */
export class SchemaField extends DataField {
    /** @inheritdoc */
    static get _defaults(): any;
    /**
     * @param {DataSchema} fields                 The contained field definitions
     * @param {DataFieldOptions} [options]        Options which configure the behavior of the field
     * @param {DataFieldContext} [context]        Additional context which describes the field
     */
    constructor(fields: DataSchema, options?: DataFieldOptions, context?: DataFieldContext);
    /**
     * The contained field definitions.
     * @type {DataSchema}
     */
    fields: DataSchema;
    /**
     * Initialize and validate the structure of the provided field definitions.
     * @param {DataSchema} fields     The provided field definitions
     * @returns {DataSchema}          The validated schema
     * @protected
     */
    protected _initialize(fields: DataSchema): DataSchema;
    /**
     * An array of field names which are present in the schema.
     * @returns {string[]}
     */
    keys(): string[];
    /**
     * An array of DataField instances which are present in the schema.
     * @returns {DataField[]}
     */
    values(): DataField[];
    /**
     * An array of [name, DataField] tuples which define the schema.
     * @returns {Array<[string, DataField]>}
     */
    entries(): Array<[string, DataField]>;
    /**
     * Test whether a certain field name belongs to this schema definition.
     * @param {string} fieldName    The field name
     * @returns {boolean}           Does the named field exist in this schema?
     */
    has(fieldName: string): boolean;
    /**
     * Get a DataField instance from the schema by name
     * @param {string} fieldName    The field name
     * @returns {DataField}         The DataField instance or undefined
     */
    get(fieldName: string): DataField;
    /**
     * Traverse the schema, obtaining the DataField definition for a particular field.
     * @param {string[]|string} fieldName       A field path like ["abilities", "strength"] or "abilities.strength"
     * @returns {SchemaField|DataField}         The corresponding DataField definition for that field, or undefined
     */
    getField(fieldName: string[] | string): SchemaField | DataField;
    /** @override */
    override _getField(path: any): this | DataField;
    /** @override */
    override _cast(value: any): any;
    /** @inheritdoc */
    _cleanType(data: any, options?: {}): any;
    /** @override */
    override initialize(value: any, model: any, options?: {}): any;
    /** @override */
    override _validateType(data: any, options?: {}): DataModelValidationFailure;
    /** @override */
    override _validateModel(changes: any, options?: {}): void;
    /** @override */
    override toObject(value: any): any;
    /** @override */
    override apply(fn: any, data?: {}, options?: {}): {};
    /**
     * Migrate this field's candidate source data.
     * @param {object} sourceData   Candidate source data of the root model
     * @param {any} fieldData       The value of this field within the source data
     */
    migrateSource(sourceData: object, fieldData: any): void;
    /**
     * Iterate over a SchemaField by iterating over its fields.
     * @type {Iterable<DataField>}
     */
    [Symbol.iterator](): Generator<any, void, unknown>;
}
/**
 * A subclass of [ArrayField]{@link ArrayField} which supports a set of contained elements.
 * Elements in this set are treated as fungible and may be represented in any order or discarded if invalid.
 */
export class SetField extends ArrayField {
    /** @override */
    override _validateElements(value: any, options: any): DataModelValidationFailure;
    /** @override */
    override _toInput(config: any): any;
    /** @inheritDoc */
    _castChangeDelta(raw: any): Set<any>;
}
/**
 * @typedef {Object} StringFieldParams
 * @property {boolean} [blank=true]       Is the string allowed to be blank (empty)?
 * @property {boolean} [trim=true]        Should any provided string be trimmed as part of cleaning?
 * @property {string[]|object|function} [choices]  An array of values or an object of values/labels which represent
 *                                        allowed choices for the field. A function may be provided which dynamically
 *                                        returns the array of choices.
 * @property {boolean} [textSearch=false] Is this string field a target for text search?
 * @typedef {DataFieldOptions&StringFieldParams} StringFieldOptions
 */
/**
 * A subclass of [DataField]{@link DataField} which deals with string-typed data.
 *
 * @property {boolean} blank=true         Is the string allowed to be blank (empty)?
 * @property {boolean} trim=true          Should any provided string be trimmed as part of cleaning?
 * @property {string[]|object|function} [choices]  An array of values or an object of values/labels which represent
 *                                        allowed choices for the field. A function may be provided which dynamically
 *                                        returns the array of choices.
 */
export class StringField extends DataField {
    /** @inheritdoc */
    static get _defaults(): any;
    /**
     * Get a record of eligible choices for the field.
     * @param {Record<any, any>|Array<any>} choices
     * @param {object} [options]
     * @param {boolean} [options.labelAttr="label"]     The property in the choice object values to use as the option label.
     * @param {boolean} [options.localize=false]        Pass each label through string localization?
     * @returns {Record<string, any>}
     * @internal
     */
    static _getChoices(choices: Record<any, any> | Array<any>, { labelAttr, localize }?: {
        labelAttr?: boolean;
        localize?: boolean;
    }): Record<string, any>;
    /**
     * @param {StringFieldOptions} [options]  Options which configure the behavior of the field
     * @param {DataFieldContext} [context]    Additional context which describes the field
     */
    constructor(options?: StringFieldOptions, context?: DataFieldContext);
    nullable: boolean;
    blank: boolean;
    /** @inheritdoc */
    clean(value: any, options: any): any;
    /** @override */
    override _cast(value: any): string;
    /** @inheritdoc */
    _validateSpecial(value: any): boolean | void;
    /** @override */
    override _validateType(value: any): boolean;
    /**
     * Test whether a provided value is a valid choice from the allowed choice set
     * @param {string} value      The provided value
     * @returns {boolean}         Is the choice valid?
     * @protected
     */
    protected _isValidChoice(value: string): boolean;
    /** @override */
    override _toInput(config: any): any;
}
/**
 * A subclass of [ObjectField]{@link ObjectField} which supports a type-specific data object.
 */
export class TypeDataField extends ObjectField {
    /**
     * Return the package that provides the sub-type for the given model.
     * @param {DataModel} model       The model instance created for this sub-type.
     * @returns {System|Module|null}
     */
    static getModelProvider(model: DataModel): System | Module | null;
    /**
     * @param {typeof foundry.abstract.Document} document  The base document class which belongs in this field
     * @param {DataFieldOptions} [options]    Options which configure the behavior of the field
     * @param {DataFieldContext} [context]    Additional context which describes the field
     */
    constructor(document: typeof foundry.abstract.Document, options?: DataFieldOptions, context?: DataFieldContext);
    /**
     * The canonical document name of the document type which belongs in this field
     * @type {typeof foundry.abstract.Document}
     */
    document: typeof foundry.abstract.Document;
    /**
     * A convenience accessor for the name of the document type associated with this TypeDataField
     * @type {string}
     */
    get documentName(): string;
    /**
     * Get the DataModel definition that should be used for this type of document.
     * @param {string} type              The Document instance type
     * @returns {typeof DataModel|null}  The DataModel class or null
     */
    getModelForType(type: string): typeof DataModel | null;
    /** @override */
    override getInitialValue(data: any): any;
    /** @override */
    override _cleanType(value: any, options: any): any;
    /** @inheritdoc */
    _validateType(data: any, options?: {}): void | DataModelValidationFailure;
    /** @override */
    override _validateModel(changes: any, options?: {}): any;
    /**
     * Migrate this field's candidate source data.
     * @param {object} sourceData   Candidate source data of the root model
     * @param {any} fieldData       The value of this field within the source data
     */
    migrateSource(sourceData: object, fieldData: any): void;
}
/**
 * @deprecated since v11
 * @see DataModelValidationError
 * @ignore
 */
export class ModelValidationError extends Error {
    /**
     * Collect all the errors into a single message for consumers who do not handle the ModelValidationError specially.
     * @param {Object<Error>|Error[]|string} errors   The raw error structure
     * @returns {string}                              A formatted error message
     */
    static formatErrors(errors: any | Error[] | string): string;
    constructor(errors: any);
    errors: any;
}
import { DataModelValidationFailure } from "./validation-failure.mjs";
import DataModel from "../abstract/data.mjs";
import EmbeddedCollection from "../abstract/embedded-collection.mjs";
import EmbeddedCollectionDelta from "../abstract/embedded-collection-delta.mjs";
