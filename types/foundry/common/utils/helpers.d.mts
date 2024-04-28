/** @module helpers */
/**
 * Benchmark the performance of a function, calling it a requested number of iterations.
 * @param {Function} func       The function to benchmark
 * @param {number} iterations   The number of iterations to test
 * @param {...any} args         Additional arguments passed to the benchmarked function
 */
export function benchmark(func: Function, iterations: number, ...args: any[]): Promise<void>;
/**
 * A debugging function to test latency or timeouts by forcibly locking the thread for an amount of time.
 * @param {number} ms        A number of milliseconds to lock
 * @returns {Promise<void>}
 */
export function threadLock(ms: number, debug?: boolean): Promise<void>;
/**
 * Wrap a callback in a debounced timeout.
 * Delay execution of the callback function until the function has not been called for delay milliseconds
 * @param {Function} callback       A function to execute once the debounced threshold has been passed
 * @param {number} delay            An amount of time in milliseconds to delay
 * @return {Function}               A wrapped function which can be called to debounce execution
 */
export function debounce(callback: Function, delay: number): Function;
/**
 * Wrap a callback in a throttled timeout.
 * Delay execution of the callback function when the last time the function was called was delay milliseconds ago
 * @param {Function} callback       A function to execute once the throttled threshold has been passed
 * @param {number} delay            An maximum amount of time in milliseconds between to execution
 * @return {Function}               A wrapped function which can be called to throttle execution
 */
export function throttle(callback: Function, delay: number): Function;
/**
 * Quickly clone a simple piece of data, returning a copy which can be mutated safely.
 * This method DOES support recursive data structures containing inner objects or arrays.
 * This method DOES NOT support advanced object types like Set, Map, or other specialized classes.
 * @param {*} original                     Some sort of data
 * @param {object} [options]               Options to configure the behaviour of deepClone
 * @param {boolean} [options.strict=false] Throw an Error if deepClone is unable to clone something instead of returning the original
 * @return {*}                             The clone of that data
 */
export function deepClone(original: any, { strict }?: {
    strict?: boolean;
}): any;
/**
 * Deeply difference an object against some other, returning the update keys and values.
 * @param {object} original       An object comparing data against which to compare
 * @param {object} other          An object containing potentially different data
 * @param {object} [options={}]   Additional options which configure the diff operation
 * @param {boolean} [options.inner=false]  Only recognize differences in other for keys which also exist in original
 * @param {boolean} [options.deletionKeys=false] Apply special logic to deletion keys. They will only be kept if the
 *                                               original object has a corresponding key that could be deleted.
 * @return {object}               An object of the data in other which differs from that in original
 */
export function diffObject(original: object, other: object, { inner, deletionKeys }?: {
    inner?: boolean;
    deletionKeys?: boolean;
}): object;
/**
 * Test if two objects contain the same enumerable keys and values.
 * @param {object} a  The first object.
 * @param {object} b  The second object.
 * @returns {boolean}
 */
export function objectsEqual(a: object, b: object): boolean;
/**
 * A cheap data duplication trick which is relatively robust.
 * For a subset of cases the deepClone function will offer better performance.
 * @param {Object} original   Some sort of data
 */
export function duplicate(original: any): any;
/**
 * Test whether some class is a subclass of a parent.
 * Returns true if the classes are identical.
 * @param {Function} cls        The class to test
 * @param {Function} parent     Some other class which may be a parent
 * @returns {boolean}           Is the class a subclass of the parent?
 */
export function isSubclass(cls: Function, parent: Function): boolean;
/**
 * Search up the prototype chain and return the class that defines the given property.
 * @param {Object|Constructor} obj    A class instance or class definition which contains a property.
 *                                    If a class instance is passed the property is treated as an instance attribute.
 *                                    If a class constructor is passed the property is treated as a static attribute.
 * @param {string} property           The property name
 * @returns {Constructor}             The class that defines the property
 */
export function getDefiningClass(obj: any | Constructor, property: string): Constructor;
/**
 * Encode a url-like string by replacing any characters which need encoding
 * To reverse this encoding, the native decodeURIComponent can be used on the whole encoded string, without adjustment.
 * @param {string} path     A fully-qualified URL or url component (like a relative path)
 * @return {string}         An encoded URL string
 */
export function encodeURL(path: string): string;
/**
 * Expand a flattened object to be a standard nested Object by converting all dot-notation keys to inner objects.
 * Only simple objects will be expanded. Other Object types like class instances will be retained as-is.
 * @param {object} obj      The object to expand
 * @return {object}         An expanded object
 */
export function expandObject(obj: object): object;
/**
 * Filter the contents of some source object using the structure of a template object.
 * Only keys which exist in the template are preserved in the source object.
 *
 * @param {object} source           An object which contains the data you wish to filter
 * @param {object} template         An object which contains the structure you wish to preserve
 * @param {object} [options={}]     Additional options which customize the filtration
 * @param {boolean} [options.deletionKeys=false]    Whether to keep deletion keys
 * @param {boolean} [options.templateValues=false]  Instead of keeping values from the source, instead draw values from the template
 *
 * @example Filter an object
 * ```js
 * const source = {foo: {number: 1, name: "Tim", topping: "olives"}, bar: "baz"};
 * const template = {foo: {number: 0, name: "Mit", style: "bold"}, other: 72};
 * filterObject(source, template); // {foo: {number: 1, name: "Tim"}};
 * filterObject(source, template, {templateValues: true}); // {foo: {number: 0, name: "Mit"}};
 * ```
 */
export function filterObject(source: object, template: object, { deletionKeys, templateValues }?: {
    deletionKeys?: boolean;
    templateValues?: boolean;
}): any;
/**
 * Flatten a possibly multi-dimensional object to a one-dimensional one by converting all nested keys to dot notation
 * @param {object} obj        The object to flatten
 * @param {number} [_d=0]     Track the recursion depth to prevent overflow
 * @return {object}           A flattened object
 */
export function flattenObject(obj: object, _d?: number): object;
/**
 * Obtain references to the parent classes of a certain class.
 * @param {Function} cls            An class definition
 * @return {Array<typeof Object>}   An array of parent classes which the provided class extends
 */
export function getParentClasses(cls: Function): Array<typeof Object>;
/**
 * Get the URL route for a certain path which includes a path prefix, if one is set
 * @param {string} path             The Foundry URL path
 * @param {string|null} [prefix]    A path prefix to apply
 * @returns {string}                The absolute URL path
 */
export function getRoute(path: string, { prefix }?: string | null): string;
/**
 * Learn the underlying data type of some variable. Supported identifiable types include:
 * undefined, null, number, string, boolean, function, Array, Set, Map, Promise, Error,
 * HTMLElement (client side only), Object (catchall for other object types)
 * @param {*} variable  A provided variable
 * @return {string}     The named type of the token
 */
export function getType(variable: any): string;
/**
 * A helper function which tests whether an object has a property or nested property given a string key.
 * The method also supports arrays if the provided key is an integer index of the array.
 * The string key supports the notation a.b.c which would return true if object[a][b][c] exists
 * @param {object} object   The object to traverse
 * @param {string} key      An object property with notation a.b.c
 * @returns {boolean}       An indicator for whether the property exists
 */
export function hasProperty(object: object, key: string): boolean;
/**
 * A helper function which searches through an object to retrieve a value by a string key.
 * The method also supports arrays if the provided key is an integer index of the array.
 * The string key supports the notation a.b.c which would return object[a][b][c]
 * @param {object} object   The object to traverse
 * @param {string} key      An object property with notation a.b.c
 * @return {*}              The value of the found property
 */
export function getProperty(object: object, key: string): any;
/**
 * A helper function which searches through an object to assign a value using a string key
 * This string key supports the notation a.b.c which would target object[a][b][c]
 * @param {object} object   The object to update
 * @param {string} key      The string key
 * @param {*} value         The value to be assigned
 * @return {boolean}        Whether the value was changed from its previous value
 */
export function setProperty(object: object, key: string, value: any): boolean;
/**
 * Invert an object by assigning its values as keys and its keys as values.
 * @param {object} obj    The original object to invert
 * @returns {object}      The inverted object with keys and values swapped
 */
export function invertObject(obj: object): object;
/**
 * Return whether a target version (v1) is more advanced than some other reference version (v0).
 * Supports either numeric or string version comparison with version parts separated by periods.
 * @param {number|string} v1    The target version
 * @param {number|string} v0    The reference version
 * @return {boolean}            Is v1 a more advanced version than v0?
 */
export function isNewerVersion(v1: number | string, v0: number | string): boolean;
/**
 * Test whether a value is empty-like; either undefined or a content-less object.
 * @param {*} value       The value to test
 * @returns {boolean}     Is the value empty-like?
 */
export function isEmpty(value: any): boolean;
/**
 * Update a source object by replacing its keys and values with those from a target object.
 *
 * @param {object} original                           The initial object which should be updated with values from the
 *                                                    target
 * @param {object} [other={}]                         A new object whose values should replace those in the source
 * @param {object} [options={}]                       Additional options which configure the merge
 * @param {boolean} [options.insertKeys=true]         Control whether to insert new top-level objects into the resulting
 *                                                    structure which do not previously exist in the original object.
 * @param {boolean} [options.insertValues=true]       Control whether to insert new nested values into child objects in
 *                                                    the resulting structure which did not previously exist in the
 *                                                    original object.
 * @param {boolean} [options.overwrite=true]          Control whether to replace existing values in the source, or only
 *                                                    merge values which do not already exist in the original object.
 * @param {boolean} [options.recursive=true]          Control whether to merge inner-objects recursively (if true), or
 *                                                    whether to simply replace inner objects with a provided new value.
 * @param {boolean} [options.inplace=true]            Control whether to apply updates to the original object in-place
 *                                                    (if true), otherwise the original object is duplicated and the
 *                                                    copy is merged.
 * @param {boolean} [options.enforceTypes=false]      Control whether strict type checking requires that the value of a
 *                                                    key in the other object must match the data type in the original
 *                                                    data to be merged.
 * @param {boolean} [options.performDeletions=false]  Control whether to perform deletions on the original object if
 *                                                    deletion keys are present in the other object.
 * @param {number} [_d=0]                             A privately used parameter to track recursion depth.
 * @returns {object}                                  The original source object including updated, inserted, or
 *                                                    overwritten records.
 *
 * @example Control how new keys and values are added
 * ```js
 * mergeObject({k1: "v1"}, {k2: "v2"}, {insertKeys: false}); // {k1: "v1"}
 * mergeObject({k1: "v1"}, {k2: "v2"}, {insertKeys: true});  // {k1: "v1", k2: "v2"}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {insertValues: false}); // {k1: {i1: "v1"}}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {insertValues: true}); // {k1: {i1: "v1", i2: "v2"}}
 * ```
 *
 * @example Control how existing data is overwritten
 * ```js
 * mergeObject({k1: "v1"}, {k1: "v2"}, {overwrite: true}); // {k1: "v2"}
 * mergeObject({k1: "v1"}, {k1: "v2"}, {overwrite: false}); // {k1: "v1"}
 * ```
 *
 * @example Control whether merges are performed recursively
 * ```js
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {recursive: false}); // {k1: {i2: "v2"}}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {recursive: true}); // {k1: {i1: "v1", i2: "v2"}}
 * ```
 *
 * @example Deleting an existing object key
 * ```js
 * mergeObject({k1: "v1", k2: "v2"}, {"-=k1": null}, {performDeletions: true});   // {k2: "v2"}
 * ```
 */
export function mergeObject(original: object, other?: object, { insertKeys, insertValues, overwrite, recursive, inplace, enforceTypes, performDeletions }?: {
    insertKeys?: boolean;
    insertValues?: boolean;
    overwrite?: boolean;
    recursive?: boolean;
    inplace?: boolean;
    enforceTypes?: boolean;
    performDeletions?: boolean;
}, _d?: number): object;
/**
 * Parse an S3 key to learn the bucket and the key prefix used for the request.
 * @param {string} key  A fully qualified key name or prefix path.
 * @returns {{bucket: string|null, keyPrefix: string}}
 */
export function parseS3URL(key: string): {
    bucket: string | null;
    keyPrefix: string;
};
/**
 * Generate a random alphanumeric string ID of a given requested length using `crypto.getRandomValues()`.
 * @param {number} length    The length of the random string to generate, which must be at most 16384.
 * @return {string}          A string containing random letters (A-Z, a-z) and numbers (0-9).
 */
export function randomID(length?: number): string;
/**
 * Express a timestamp as a relative string
 * @param {Date|string} timeStamp   A timestamp string or Date object to be formatted as a relative time
 * @return {string}                 A string expression for the relative time
 */
export function timeSince(timeStamp: Date | string): string;
/**
 * Format a file size to an appropriate order of magnitude.
 * @param {number} size  The size in bytes.
 * @param {object} [options]
 * @param {number} [options.decimalPlaces=2]  The number of decimal places to round to.
 * @param {2|10} [options.base=10]            The base to use. In base 10 a kilobyte is 1000 bytes. In base 2 it is
 *                                            1024 bytes.
 * @returns {string}
 */
export function formatFileSize(size: number, { decimalPlaces, base }?: {
    decimalPlaces?: number;
    base?: 2 | 10;
}): string;
/**
 * @typedef {object} ResolvedUUID
 * @property {string} uuid                      The original UUID.
 * @property {string} [type]                    The type of Document referenced. Legacy compendium UUIDs will not
 *                                              populate this field if the compendium is not active in the World.
 * @property {string} id                        The ID of the Document referenced.
 * @property {string} [primaryType]             The primary Document type of this UUID. Only present if the Document
 *                                              is embedded.
 * @property {string} [primaryId]               The primary Document ID of this UUID. Only present if the Document
 *                                              is embedded.
 * @property {DocumentCollection} [collection]  The collection that the primary Document belongs to.
 * @property {string[]} embedded                Additional Embedded Document parts.
 * @property {Document} [doc]                   An already-resolved parent Document.
 * @property {string} [documentType]            Either the document type or the parent type. Retained for backwards
 *                                              compatibility.
 * @property {string} [documentId]              Either the document id or the parent id. Retained for backwards
 *                                              compatibility.
 */
/**
 * Parse a UUID into its constituent parts, identifying the type and ID of the referenced document.
 * The ResolvedUUID result also identifies a "primary" document which is a root-level document either in the game
 * World or in a Compendium pack which is a parent of the referenced document.
 * @param {string} uuid                  The UUID to parse.
 * @param {object} [options]             Options to configure parsing behavior.
 * @param {foundry.abstract.Document} [options.relative]  A document to resolve relative UUIDs against.
 * @returns {ResolvedUUID}               Returns the Collection, Document Type, and Document ID to resolve the parent
 *                                       document, as well as the remaining Embedded Document parts, if any.
 * @throws {Error}                       An error if the provided uuid string is incorrectly structured
 */
export function parseUuid(uuid: string, { relative }?: {
    relative?: foundry.abstract.Document;
}): ResolvedUUID;
/**
 * A utility function to reload the page with a debounce.
 */
export type debouncedReload = () => any;
/**
 * A utility function to reload the page with a debounce.
 * @callback debouncedReload
 */
export const debouncedReload: Function;
export type ResolvedUUID = {
    /**
     * The original UUID.
     */
    uuid: string;
    /**
     * The type of Document referenced. Legacy compendium UUIDs will not
     *                     populate this field if the compendium is not active in the World.
     */
    type?: string;
    /**
     * The ID of the Document referenced.
     */
    id: string;
    /**
     * The primary Document type of this UUID. Only present if the Document
     *              is embedded.
     */
    primaryType?: string;
    /**
     * The primary Document ID of this UUID. Only present if the Document
     *                is embedded.
     */
    primaryId?: string;
    /**
     * The collection that the primary Document belongs to.
     */
    collection?: DocumentCollection;
    /**
     * Additional Embedded Document parts.
     */
    embedded: string[];
    /**
     * An already-resolved parent Document.
     */
    doc?: Document;
    /**
     * Either the document type or the parent type. Retained for backwards
     *             compatibility.
     */
    documentType?: string;
    /**
     * Either the document id or the parent id. Retained for backwards
     *               compatibility.
     */
    documentId?: string;
};
