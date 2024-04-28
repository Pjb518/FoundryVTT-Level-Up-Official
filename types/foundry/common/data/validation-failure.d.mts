/**
 * A class responsible for recording information about a validation failure.
 */
export class DataModelValidationFailure {
    /**
     * Format a DataModelValidationFailure instance as a string message.
     * @param {DataModelValidationFailure} failure    The failure instance
     * @param {number} _d                             An internal depth tracker
     * @returns {string}                              The formatted failure string
     */
    static "__#1@#formatString"(failure: DataModelValidationFailure, _d?: number): string;
    /**
     * @param {any} [invalidValue]       The value that failed validation for this field.
     * @param {any} [fallback]           The value it was replaced by, if any.
     * @param {boolean} [dropped=false]  Whether the value was dropped from some parent collection.
     * @param {string} [message]         The validation error message.
     * @param {boolean} [unresolved=false]     Whether this failure was unresolved
     */
    constructor({ invalidValue, fallback, dropped, message, unresolved }?: any);
    /**
     * The value that failed validation for this field.
     * @type {any}
     */
    invalidValue: any;
    /**
     * The value it was replaced by, if any.
     * @type {any}
     */
    fallback: any;
    /**
     * Whether the value was dropped from some parent collection.
     * @type {boolean}
     */
    dropped: boolean;
    /**
     * The validation error message.
     * @type {string}
     */
    message: string;
    /**
     * Record whether a validation failure is unresolved.
     * This reports as true if validation for this field or any hierarchically contained field is unresolved.
     * A failure is unresolved if the value was invalid and there was no valid fallback value available.
     * @type {boolean}
     */
    unresolved: boolean;
    /**
     * If this field contains other fields that are validated as part of its validation, their results are recorded here.
     * @type {Object<DataModelValidationFailure>}
     */
    fields: any;
    /**
     * @typedef {object} ElementValidationFailure
     * @property {string|number} id                    Either the element's index or some other identifier for it.
     * @property {string} [name]                       Optionally a user-friendly name for the element.
     * @property {DataModelValidationFailure} failure  The element's validation failure.
     */
    /**
     * If this field contains a list of elements that are validated as part of its validation, their results are recorded
     * here.
     * @type {ElementValidationFailure[]}
     */
    elements: {
        /**
         * Either the element's index or some other identifier for it.
         */
        id: string | number;
        /**
         * Optionally a user-friendly name for the element.
         */
        name?: string;
        /**
         * The element's validation failure.
         */
        failure: DataModelValidationFailure;
    }[];
    /**
     * Return this validation failure as an Error object.
     * @returns {DataModelValidationError}
     */
    asError(): DataModelValidationError;
    /**
     * Whether this failure contains other sub-failures.
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Return the base properties of this failure, omitting any nested failures.
     * @returns {{invalidValue: any, fallback: any, dropped: boolean, message: string}}
     */
    toObject(): {
        invalidValue: any;
        fallback: any;
        dropped: boolean;
        message: string;
    };
    /**
     * Represent the DataModelValidationFailure as a string.
     * @returns {string}
     */
    toString(): string;
}
/**
 * A specialised Error to indicate a model validation failure.
 * @extends {Error}
 */
export class DataModelValidationError extends Error {
    /**
     * Collect nested failures into an aggregate object.
     * @param {DataModelValidationFailure} failure                               The failure.
     * @returns {DataModelValidationFailure|Object<DataModelValidationFailure>}  Returns the failure at the leaf of the
     *                                                                           tree, otherwise an object of
     *                                                                           sub-failures.
     */
    static "__#2@#aggregateFailures"(failure: DataModelValidationFailure): DataModelValidationFailure | any;
    /**
     * @param {DataModelValidationFailure|string} failure  The failure that triggered this error or an error message
     * @param {...any} [params]                            Additional Error constructor parameters
     */
    constructor(failure: DataModelValidationFailure | string, ...params?: any[]);
    /**
     * Retrieve the root failure that caused this error, or a specific sub-failure via a path.
     * @param {string} [path]  The property path to the failure.
     * @returns {DataModelValidationFailure}
     *
     * @example Retrieving a failure.
     * ```js
     * const changes = {
     *   "foo.bar": "validValue",
     *   "foo.baz": "invalidValue"
     * };
     * try {
     *   doc.validate(expandObject(changes));
     * } catch ( err ) {
     *   const failure = err.getFailure("foo.baz");
     *   console.log(failure.invalidValue); // "invalidValue"
     * }
     * ```
     */
    getFailure(path?: string): DataModelValidationFailure;
    /**
     * Retrieve a flattened object of all the properties that failed validation as part of this error.
     * @returns {Object<DataModelValidationFailure>}
     *
     * @example Removing invalid changes from an update delta.
     * ```js
     * const changes = {
     *   "foo.bar": "validValue",
     *   "foo.baz": "invalidValue"
     * };
     * try {
     *   doc.validate(expandObject(changes));
     * } catch ( err ) {
     *   const failures = err.getAllFailures();
     *   if ( failures ) {
     *     for ( const prop in failures ) delete changes[prop];
     *     doc.validate(expandObject(changes));
     *   }
     * }
     * ```
     */
    getAllFailures(): any;
    /**
     * Log the validation error as a table.
     */
    logAsTable(): void;
    /**
     * Generate a nested tree view of the error as an HTML string.
     * @returns {string}
     */
    asHTML(): string;
    #private;
}
