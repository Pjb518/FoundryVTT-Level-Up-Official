/**
 * @typedef {Object<DataField>}  DataSchema
 */
/**
 * @typedef {Object} DataValidationOptions
 * @property {boolean} [strict=true]     Throw an error if validation fails.
 * @property {boolean} [fallback=false]  Attempt to replace invalid values with valid defaults?
 * @property {boolean} [partial=false]   Allow partial source data, ignoring absent fields?
 * @property {boolean} [dropInvalidEmbedded=false]  If true, invalid embedded documents will emit a warning and be
 *                                                  placed in the invalidDocuments collection rather than causing the
 *                                                  parent to be considered invalid.
 */
/**
 * The abstract base class which defines the data schema contained within a Document.
 * @param {object} [data={}]                    Initial data used to construct the data object. The provided object
 *                                              will be owned by the constructed model instance and may be mutated.
 * @param {DataValidationOptions} [options={}]  Options which affect DataModel construction
 * @param {Document} [options.parent]           A parent DataModel instance to which this DataModel belongs
 * @abstract
 */
import { SchemaField, DataField } from '../data/fields.d.mts';
import { DataModelValidationFailure } from '../data/validation-failure.d.mts';

export default class DataModel {
  /**
   * The defined and cached Data Schema for all instances of this DataModel.
   * @type {SchemaField}
   * @private
   */
  private static _schema;

  /**
   * Define the data schema for documents of this type.
   * The schema is populated the first time it is accessed and cached for future reuse.
   * @virtual
   * @returns {DataSchema}
   */
  static defineSchema(): DataSchema;
  /**
   * The Data Schema for all instances of this DataModel.
   * @type {SchemaField}
   */
  static get schema(): SchemaField;
  /**
   * Clean a data source object to conform to a specific provided schema.
   * @param {object} [source]         The source data object
   * @param {object} [options={}]     Additional options which are passed to field cleaning methods
   * @returns {object}                The cleaned source data
   */
  static cleanData(source?: object, options?: object): object;
  /**
   * A generator that orders the DataFields in the DataSchema into an expected initialization order.
   * @returns {Generator<[string,DataField]>}
   * @protected
   */
  protected static _initializationOrder(): Generator<[string, DataField]>;
  /**
   * Evaluate joint validation rules which apply validation conditions across multiple fields of the model.
   * Field-specific validation rules should be defined as part of the DataSchema for the model.
   * This method allows for testing aggregate rules which impose requirements on the overall model.
   * @param {object} data     Candidate data for the model
   * @throws                  An error if a validation failure is detected
   */
  static validateJoint(data: object): any;
  /**
   * Update the source data for a specific DataSchema.
   * This method assumes that both source and changes are valid objects.
   * @param {SchemaField} schema      The data schema to update
   * @param {object} source           Source data to be updated
   * @param {object} changes          Changes to apply to the source data
   * @param {object} [options={}]     Options which modify the update workflow
   * @returns {object}                The updated source data
   * @throws                          An error if the update operation was unsuccessful
   * @private
   */
  private static '__#12@#updateData';

  /**
   * Update the source data for a specific DataField.
   * @param {string} name             The field name being updated
   * @param {DataField} field         The field definition being updated
   * @param {object} source           The source object being updated
   * @param {*} value                 The new value for the field
   * @param {object} options          Options which modify the update workflow
   * @throws                          An error if the new candidate value is invalid
   * @private
   */
  private static '__#12@#updateField';

  /**
   * Create a new instance of this DataModel from a source record.
   * The source is presumed to be trustworthy and is not strictly validated.
   * @param {object} source                    Initial document data which comes from a trusted source.
   * @param {DocumentConstructionContext & DataValidationOptions} [context]  Model construction context
   * @param {boolean} [context.strict=false]   Models created from trusted source data are validated non-strictly
   * @returns {DataModel}
   */
  static fromSource(source: object, { strict, ...context }?: DocumentConstructionContext & DataValidationOptions): DataModel;
  /**
   * Create a DataModel instance using a provided serialized JSON string.
   * @param {string} json       Serialized document data in string format
   * @returns {DataModel}       A constructed data model instance
   */
  static fromJSON(json: string): DataModel;
  /**
   * Migrate candidate source data for this DataModel which may require initial cleaning or transformations.
   * @param {object} source           The candidate source data from which the model will be constructed
   * @returns {object}                Migrated source data, if necessary
   */
  static migrateData(source: object): object;
  /**
   * Wrap data migration in a try/catch which attempts it safely
   * @param {object} source           The candidate source data from which the model will be constructed
   * @returns {object}                Migrated source data, if necessary
   */
  static migrateDataSafe(source: object): object;
  /**
   * Take data which conforms to the current data schema and add backwards-compatible accessors to it in order to
   * support older code which uses this data.
   * @param {object} data         Data which matches the current schema
   * @param {object} [options={}] Additional shimming options
   * @param {boolean} [options.embedded=true] Apply shims to embedded models?
   * @returns {object}            Data with added backwards-compatible properties
   */
  static shimData(data: object, { embedded }?: {
    embedded?: boolean;
  }): object;
  constructor(data?: {}, { parent, strict, ...options }?: {
    parent?: any;
    strict?: boolean;
  });
  /**
   * Configure the data model instance before validation and initialization workflows are performed.
   * @protected
   */
  protected _configure(options?: {}): void;
  /**
   * The source data object for this DataModel instance.
   * Once constructed, the source object is sealed such that no keys may be added nor removed.
   * @type {object}
   */
  _source: object;

  /**
   * An immutable reverse-reference to a parent DataModel to which this model belongs.
   * @type {DataModel|null}
   */
  parent: DataModel | null;

  /**
   * Define the data schema for this document instance.
   * @type {SchemaField}
   */
  get schema(): SchemaField;
  /**
   * Is the current state of this DataModel invalid?
   * The model is invalid if there is any unresolved failure.
   * @type {boolean}
   */
  get invalid(): boolean;
  /**
   * An array of validation failure instances which may have occurred when this instance was last validated.
   * @type {{fields: DataModelValidationFailure|null, joint: DataModelValidationFailure|null}}
   */
  get validationFailures(): {
    fields: DataModelValidationFailure | null;
    joint: DataModelValidationFailure | null;
  };
  /**
   * Initialize the source data for a new DataModel instance.
   * One-time migrations and initial cleaning operations are applied to the source data.
   * @param {object|DataModel} data   The candidate source data from which the model will be constructed
   * @param {object} [options]        Options provided to the model constructor
   * @returns {object}                Migrated and cleaned source data which will be stored to the model instance
   * @protected
   */
  protected _initializeSource(data: object | DataModel, options?: object): object;
  /**
   * Initialize the instance by copying data from the source object to instance attributes.
   * This mirrors the workflow of SchemaField#initialize but with some added functionality.
   * @param {object} [options]        Options provided to the model constructor
   * @protected
   */
  protected _initialize(options?: object): void;
  /**
   * Reset the state of this data instance back to mirror the contained source data, erasing any changes.
   */
  reset(): void;
  /**
   * Clone a model, creating a new data model by combining current data with provided overrides.
   * @param {Object} [data={}]                    Additional data which overrides current document data at the time of creation
   * @param {object} [context={}]                 Context options passed to the data model constructor
   * @returns {Document|Promise<Document>}        The cloned Document instance
   */
  clone(data?: any, context?: object): Document | Promise<Document>;
  /**
   * Validate the data contained in the document to check for type and content
   * This function throws an error if data within the document is not valid
   *
   * @param {object} options                    Optional parameters which customize how validation occurs.
   * @param {object} [options.changes]          A specific set of proposed changes to validate, rather than the full
   *                                            source data of the model.
   * @param {boolean} [options.clean=false]     If changes are provided, attempt to clean the changes before validating
   *                                            them?
   * @param {boolean} [options.fallback=false]  Allow replacement of invalid values with valid defaults?
   * @param {boolean} [options.dropInvalidEmbedded=false]  If true, invalid embedded documents will emit a warning and
   *                                                       be placed in the invalidDocuments collection rather than
   *                                                       causing the parent to be considered invalid.
   * @param {boolean} [options.strict=true]     Throw if an invalid value is encountered, otherwise log a warning?
   * @param {boolean} [options.fields=true]     Perform validation on individual fields?
   * @param {boolean} [options.joint]           Perform joint validation on the full data model?
   *                                            Joint validation will be performed by default if no changes are passed.
   *                                            Joint validation will be disabled by default if changes are passed.
   *                                            Joint validation can be performed on a complete set of changes (for
   *                                            example testing a complete data model) by explicitly passing true.
   * @return {boolean}                          An indicator for whether the document contains valid data
   */
  validate({
    changes, clean, fallback, dropInvalidEmbedded, strict, fields, joint }
    ?: {
      changes?: object;
      clean?: boolean;
      fallback?: boolean;
      dropInvalidEmbedded?: boolean;
      strict?: boolean;
      fields?: boolean;
      joint?: boolean;
    }): boolean;
  /**
   * Update the DataModel locally by applying an object of changes to its source data.
   * The provided changes are cleaned, validated, and stored to the source data object for this model.
   * The source data is then re-initialized to apply those changes to the prepared data.
   * The method returns an object of differential changes which modified the original data.
   *
   * @param {object} changes          New values which should be applied to the data model
   * @param {object} [options={}]     Options which determine how the new data is merged
   * @returns {object}                An object containing the changed keys and values
   */
  updateSource(changes?: object, options?: object): object;
  /**
   * Copy and transform the DataModel into a plain object.
   * Draw the values of the extracted object from the data source (by default) otherwise from its transformed values.
   * @param {boolean} [source=true]     Draw values from the underlying data source rather than transformed values
   * @returns {object}                  The extracted primitive object
   */
  toObject(source?: boolean): object;
  /**
   * Extract the source data for the DataModel into a simple object format that can be serialized.
   * @returns {object}          The document source data expressed as a plain object
   */
  toJSON(): object;
  #private;
}
export type DataSchema = any;
export type DataValidationOptions = {
  /**
   * Throw an error if validation fails.
   */
  strict?: boolean;
  /**
   * Attempt to replace invalid values with valid defaults?
   */
  fallback?: boolean;
  /**
   * Allow partial source data, ignoring absent fields?
   */
  partial?: boolean;
  /**
   * If true, invalid embedded documents will emit a warning and be
   *   placed in the invalidDocuments collection rather than causing the
   *   parent to be considered invalid.
   */
  dropInvalidEmbedded?: boolean;
};
