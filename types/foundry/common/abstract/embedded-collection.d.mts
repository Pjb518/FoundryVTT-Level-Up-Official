/**
 * An extension of the Collection.
 * Used for the specific task of containing embedded Document instances within a parent Document.
 */
export default class EmbeddedCollection extends Collection<any, any> {
    /**
     * @param {string} name           The name of this collection in the parent Document.
     * @param {DataModel} parent      The parent DataModel instance to which this collection belongs.
     * @param {object[]} sourceArray  The source data array for the collection in the parent Document data.
     */
    constructor(name: string, parent: DataModel, sourceArray: object[]);
    /**
     * The Document implementation used to construct instances within this collection.
     * @type {typeof foundry.abstract.Document}
     */
    documentClass: typeof foundry.abstract.Document;
    /**
     * The name of this collection in the parent Document.
     * @type {string}
     */
    name: string;
    /**
     * The parent DataModel to which this EmbeddedCollection instance belongs.
     * @type {DataModel}
     */
    model: DataModel;
    /**
     * Has this embedded collection been initialized as a one-time workflow?
     * @type {boolean}
     * @protected
     */
    protected _initialized: boolean;
    /**
     * The source data array from which the embedded collection is created
     * @type {object[]}
     * @private
     */
    private _source;
    /**
     * Record the set of document ids where the Document was not initialized because of invalid source data
     * @type {Set<string>}
     */
    invalidDocumentIds: Set<string>;
    /**
     * Instantiate a Document for inclusion in the Collection.
     * @param {object} data       The Document data.
     * @param {DocumentConstructionContext} [context]  Document creation context.
     * @returns {Document}
     */
    createDocument(data: object, context?: DocumentConstructionContext): Document;
    /**
     * Initialize the EmbeddedCollection object by constructing its contained Document instances
     * @param {DocumentConstructionContext} [options]  Initialization options.
     */
    initialize(options?: DocumentConstructionContext): void;
    /**
     * Initialize an embedded document and store it in the collection.
     * @param {object} data                    The Document data.
     * @param {DocumentConstructionContext} [context]  Context to configure Document initialization.
     * @protected
     */
    protected _initializeDocument(data: object, context?: DocumentConstructionContext): void;
    /**
     * Log warnings or errors when a Document is found to be invalid.
     * @param {string} id                      The invalid Document's ID.
     * @param {Error} err                      The validation error.
     * @param {object} [options]               Options to configure invalid Document handling.
     * @param {boolean} [options.strict=true]  Whether to throw an error or only log a warning.
     * @protected
     */
    protected _handleInvalidDocument(id: string, err: Error, { strict }?: {
        strict?: boolean;
    }): void;
    /**
     * Get an element from the EmbeddedCollection by its ID.
     * @param {string} id                        The ID of the Embedded Document to retrieve.
     * @param {object} [options]                 Additional options to configure retrieval.
     * @param {boolean} [options.strict=false]   Throw an Error if the requested Embedded Document does not exist.
     * @param {boolean} [options.invalid=false]  Allow retrieving an invalid Embedded Document.
     * @returns {Document}
     * @throws If strict is true and the Embedded Document cannot be found.
     */
    get(id: string, { invalid, strict }?: {
        strict?: boolean;
        invalid?: boolean;
    }): Document;
    /**
     * Add an item to the collection.
     * @param {string} key                           The embedded Document ID.
     * @param {Document} value                       The embedded Document instance.
     * @param {object} [options]                     Additional options to the set operation.
     * @param {boolean} [options.modifySource=true]  Whether to modify the collection's source as part of the operation.
     * */
    set(key: string, value: Document, { modifySource, ...options }?: {
        modifySource?: boolean;
    }): this;
    /**
     * Modify the underlying source array to include the Document.
     * @param {string} key      The Document ID key.
     * @param {Document} value  The Document.
     * @protected
     */
    protected _set(key: string, value: Document): void;
    /**
     * @param {string} key                           The embedded Document ID.
     * @param {object} [options]                     Additional options to the delete operation.
     * @param {boolean} [options.modifySource=true]  Whether to modify the collection's source as part of the operation.
     * */
    delete(key: string, { modifySource, ...options }?: {
        modifySource?: boolean;
    }): boolean;
    /**
     * Remove the value from the underlying source array.
     * @param {string} key        The Document ID key.
     * @param {object} [options]  Additional options to configure deletion behavior.
     * @protected
     */
    protected _delete(key: string, options?: object): void;
    /**
     * Update an EmbeddedCollection using an array of provided document data.
     * @param {DataModel[]} changes         An array of provided Document data
     * @param {object} [options={}]         Additional options which modify how the collection is updated
     */
    update(changes: DataModel[], options?: object): void;
    /**
     * Create or update an embedded Document in this collection.
     * @param {DataModel} data       The update delta.
     * @param {object} [options={}]  Additional options which modify how the collection is updated.
     * @protected
     */
    protected _createOrUpdate(data: DataModel, options?: object): void;
    /**
     * Obtain a temporary Document instance for a document id which currently has invalid source data.
     * @param {string} id                      A document ID with invalid source data.
     * @param {object} [options]               Additional options to configure retrieval.
     * @param {boolean} [options.strict=true]  Throw an Error if the requested ID is not in the set of invalid IDs for
     *                                         this collection.
     * @returns {Document}                     An in-memory instance for the invalid Document
     * @throws If strict is true and the requested ID is not in the set of invalid IDs for this collection.
     */
    getInvalid(id: string, { strict }?: {
        strict?: boolean;
    }): Document;
    /**
     * Convert the EmbeddedCollection to an array of simple objects.
     * @param {boolean} [source=true]     Draw data for contained Documents from the underlying data source?
     * @returns {object[]}                The extracted array of primitive objects
     */
    toObject(source?: boolean): object[];
    /**
     * Follow-up actions to take when a database operation modifies Documents in this EmbeddedCollection.
     * @param {DatabaseAction} action                   The database action performed
     * @param {foundry.abstract.Document[]} documents   The array of modified Documents
     * @param {any[]} result                            The result of the database operation
     * @param {DatabaseOperation} operation             Database operation details
     * @param {foundry.documents.BaseUser} user         The User who performed the operation
     * @internal
     */
    _onModifyContents(action: DatabaseAction, documents: foundry.abstract.Document[], result: any[], operation: DatabaseOperation, user: foundry.documents.BaseUser): void;
}
import Collection from "../utils/collection.mjs";
