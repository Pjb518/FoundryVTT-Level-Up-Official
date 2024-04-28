/**
 * An extension of the base DataModel which defines a Document.
 * Documents are special in that they are persisted to the database and referenced by _id.
 * @memberof abstract
 * @abstract
 * @alias foundry.abstract.Document
 *
 * @param {object} data                           Initial data from which to construct the Document
 * @param {DocumentConstructionContext} context   Construction context options
 *
 * @property {string|null} _id                    The document identifier, unique within its Collection, or null if the
 *                                                Document has not yet been assigned an identifier
 * @property {string} [name]                      Documents typically have a human-readable name
 * @property {DataModel} [system]                 Certain document types may have a system data model which contains
 *                                                subtype-specific data defined by the game system or a module
 * @property {DocumentStats} [_stats]             Primary document types have a _stats object which provides metadata
 *                                                about their status
 * @property {Record<string, any>} flags          Documents each have an object of arbitrary flags which are used by
 *                                                systems or modules to store additional Document-specific data
 */
export default class Document extends DataModel {
    /**
     * A set of localization prefix paths which are used by this Document model.
     * @type {string[]}
     */
    static LOCALIZATION_PREFIXES: string[];
    /** @override */
    static override _initializationOrder(): Generator<any[], void, unknown>;
    /**
     * Default metadata which applies to each instance of this Document type.
     * @type {object}
     */
    static metadata: object;
    /**
     * The database backend used to execute operations and handle results.
     * @type {abstract.DatabaseBackend}
     */
    static get database(): abstract.DatabaseBackend;
    /**
     * Return a reference to the configured subclass of this base Document type.
     * @type {Class}
     */
    static get implementation(): Class;
    /**
     * The named collection to which this Document belongs.
     * @type {string}
     */
    static get collectionName(): string;
    /**
     * The canonical name of this Document type, for example "Actor".
     * @type {string}
     */
    static get documentName(): string;
    /**
     * The allowed types which may exist for this Document class.
     * @type {string[]}
     */
    static get TYPES(): string[];
    /**
     * Does this Document support additional subtypes?
     * @type {boolean}
     */
    static get hasTypeData(): boolean;
    /**
     * The Embedded Document hierarchy for this Document.
     * @returns {Readonly<Record<string, EmbeddedCollectionField|EmbeddedDocumentField>>}
     */
    static get hierarchy(): Readonly<Record<string, any>>;
    /**
     * Test whether a given User has a sufficient role in order to create Documents of this type in general.
     * @param {documents.BaseUser} user       The User being tested
     * @return {boolean}                      Does the User have a sufficient role to create?
     */
    static canUserCreate(user: documents.BaseUser): boolean;
    /**
     * Create multiple Documents using provided input data.
     * Data is provided as an array of objects where each individual object becomes one new Document.
     *
     * @param {object[]} data           An array of data objects used to create multiple documents
     * @param {Partial<Omit<DatabaseCreateOperation, "data">>} [operation={}]  Parameters of the requested creation
     *                                  operation
     * @return {Promise<Document[]>}    An array of created Document instances
     *
     * @example Create a single Document
     * ```js
     * const data = [{name: "New Actor", type: "character", img: "path/to/profile.jpg"}];
     * const created = await Actor.createDocuments(data);
     * ```
     *
     * @example Create multiple Documents
     * ```js
     * const data = [{name: "Tim", type: "npc"], [{name: "Tom", type: "npc"}];
     * const created = await Actor.createDocuments(data);
     * ```
     *
     * @example Create multiple embedded Documents within a parent
     * ```js
     * const actor = game.actors.getName("Tim");
     * const data = [{name: "Sword", type: "weapon"}, {name: "Breastplate", type: "equipment"}];
     * const created = await Item.createDocuments(data, {parent: actor});
     * ```
     *
     * @example Create a Document within a Compendium pack
     * ```js
     * const data = [{name: "Compendium Actor", type: "character", img: "path/to/profile.jpg"}];
     * const created = await Actor.createDocuments(data, {pack: "mymodule.mypack"});
     * ```
     */
    static createDocuments(data?: object[], operation?: Partial<Omit<DatabaseCreateOperation, "data">>): Promise<Document[]>;
    /**
     * Update multiple Document instances using provided differential data.
     * Data is provided as an array of objects where each individual object updates one existing Document.
     *
     * @param {object[]} updates          An array of differential data objects, each used to update a single Document
     * @param {Partial<Omit<DatabaseUpdateOperation, "updates">>} [operation={}] Parameters of the database update
     *                                    operation
     * @return {Promise<Document[]>}      An array of updated Document instances
     *
     * @example Update a single Document
     * ```js
     * const updates = [{_id: "12ekjf43kj2312ds", name: "Timothy"}];
     * const updated = await Actor.updateDocuments(updates);
     * ```
     *
     * @example Update multiple Documents
     * ```js
     * const updates = [{_id: "12ekjf43kj2312ds", name: "Timothy"}, {_id: "kj549dk48k34jk34", name: "Thomas"}]};
     * const updated = await Actor.updateDocuments(updates);
     * ```
     *
     * @example Update multiple embedded Documents within a parent
     * ```js
     * const actor = game.actors.getName("Timothy");
     * const updates = [{_id: sword.id, name: "Magic Sword"}, {_id: shield.id, name: "Magic Shield"}];
     * const updated = await Item.updateDocuments(updates, {parent: actor});
     * ```
     *
     * @example Update Documents within a Compendium pack
     * ```js
     * const actor = await pack.getDocument(documentId);
     * const updated = await Actor.updateDocuments([{_id: actor.id, name: "New Name"}], {pack: "mymodule.mypack"});
     * ```
     */
    static updateDocuments(updates?: object[], operation?: Partial<Omit<DatabaseUpdateOperation, "updates">>): Promise<Document[]>;
    /**
     * Delete one or multiple existing Documents using an array of provided ids.
     * Data is provided as an array of string ids for the documents to delete.
     *
     * @param {string[]} ids              An array of string ids for the documents to be deleted
     * @param {Partial<Omit<DatabaseDeleteOperation, "ids">>} [operation={}]  Parameters of the database deletion
     *                                    operation
     * @return {Promise<Document[]>}      An array of deleted Document instances
     *
     * @example Delete a single Document
     * ```js
     * const tim = game.actors.getName("Tim");
     * const deleted = await Actor.deleteDocuments([tim.id]);
     * ```
     *
     * @example Delete multiple Documents
     * ```js
     * const tim = game.actors.getName("Tim");
     * const tom = game.actors.getName("Tom");
     * const deleted = await Actor.deleteDocuments([tim.id, tom.id]);
     * ```
     *
     * @example Delete multiple embedded Documents within a parent
     * ```js
     * const tim = game.actors.getName("Tim");
     * const sword = tim.items.getName("Sword");
     * const shield = tim.items.getName("Shield");
     * const deleted = await Item.deleteDocuments([sword.id, shield.id], parent: actor});
     * ```
     *
     * @example Delete Documents within a Compendium pack
     * ```js
     * const actor = await pack.getDocument(documentId);
     * const deleted = await Actor.deleteDocuments([actor.id], {pack: "mymodule.mypack"});
     * ```
     */
    static deleteDocuments(ids?: string[], operation?: Partial<Omit<DatabaseDeleteOperation, "ids">>): Promise<Document[]>;
    /**
     * Create a new Document using provided input data, saving it to the database.
     * @see Document.createDocuments
     * @param {object} [data={}]          Initial data used to create this Document
     * @param {Partial<Omit<DatabaseCreateOperation, "data">>} [operation={}]  Parameters of the creation operation
     * @return {Promise<Document>}        The created Document instance
     *
     * @example Create a World-level Item
     * ```js
     * const data = [{name: "Special Sword", type: "weapon"}];
     * const created = await Item.create(data);
     * ```
     *
     * @example Create an Actor-owned Item
     * ```js
     * const data = [{name: "Special Sword", type: "weapon"}];
     * const actor = game.actors.getName("My Hero");
     * const created = await Item.create(data, {parent: actor});
     * ```
     *
     * @example Create an Item in a Compendium pack
     * ```js
     * const data = [{name: "Special Sword", type: "weapon"}];
     * const created = await Item.create(data, {pack: "mymodule.mypack"});
     * ```
     */
    static create(data?: object, operation?: Partial<Omit<DatabaseCreateOperation, "data">>): Promise<Document>;
    /**
     * Get a World-level Document of this type by its id.
     * @param {string} documentId         The Document ID
     * @param {DatabaseGetOperation} [operation={}] Parameters of the get operation
     * @returns {abstract.Document|null}  The retrieved Document, or null
     */
    static get(documentId: string, operation?: DatabaseGetOperation): abstract.Document | null;
    /**
     * A compatibility method that returns the appropriate name of an embedded collection within this Document.
     * @param {string} name    An existing collection name or a document name.
     * @returns {string|null}  The provided collection name if it exists, the first available collection for the
     *                         document name provided, or null if no appropriate embedded collection could be found.
     * @example Passing an existing collection name.
     * ```js
     * Actor.getCollectionName("items");
     * // returns "items"
     * ```
     *
     * @example Passing a document name.
     * ```js
     * Actor.getCollectionName("Item");
     * // returns "items"
     * ```
     */
    static getCollectionName(name: string): string | null;
    /**
     * Pre-process a creation operation, potentially altering its instructions or input data. Pre-operation events only
     * occur for the client which requested the operation.
     *
     * This batch-wise workflow occurs after individual {@link Document#_preCreate} workflows and provides a final
     * pre-flight check before a database operation occurs.
     *
     * Modifications to pending documents must mutate the documents array or alter individual document instances using
     * {@link Document#updateSource}.
     *
     * @param {Document[]} documents                Pending document instances to be created
     * @param {DatabaseCreateOperation} operation   Parameters of the database creation operation
     * @param {documents.BaseUser} user             The User requesting the creation operation
     * @returns {Promise<boolean|void>}             Return false to cancel the creation operation entirely
     * @internal
     */
    static _preCreateOperation(documents: Document[], operation: DatabaseCreateOperation, user: documents.BaseUser): Promise<boolean | void>;
    /**
     * Post-process a creation operation, reacting to database changes which have occurred. Post-operation events occur
     * for all connected clients.
     *
     * This batch-wise workflow occurs after individual {@link Document#_onCreate} workflows.
     *
     * @param {Document[]} documents                The Document instances which were created
     * @param {DatabaseCreateOperation} operation   Parameters of the database creation operation
     * @param {documents.BaseUser} user             The User who performed the creation operation
     * @returns {Promise<void>}
     * @internal
     */
    static _onCreateOperation(documents: Document[], operation: DatabaseCreateOperation, user: documents.BaseUser): Promise<void>;
    /**
     * Pre-process an update operation, potentially altering its instructions or input data. Pre-operation events only
     * occur for the client which requested the operation.
     *
     * This batch-wise workflow occurs after individual {@link Document#_preUpdate} workflows and provides a final
     * pre-flight check before a database operation occurs.
     *
     * Modifications to the requested updates are performed by mutating the data array of the operation.
     * {@link Document#updateSource}.
     *
     * @param {Document[]} documents                Document instances to be updated
     * @param {DatabaseUpdateOperation} operation   Parameters of the database update operation
     * @param {documents.BaseUser} user             The User requesting the update operation
     * @returns {Promise<boolean|void>}             Return false to cancel the update operation entirely
     * @internal
     */
    static _preUpdateOperation(documents: Document[], operation: DatabaseUpdateOperation, user: documents.BaseUser): Promise<boolean | void>;
    /**
     * Post-process an update operation, reacting to database changes which have occurred. Post-operation events occur
     * for all connected clients.
     *
     * This batch-wise workflow occurs after individual {@link Document#_onUpdate} workflows.
     *
     * @param {Document[]} documents                The Document instances which were updated
     * @param {DatabaseUpdateOperation} operation   Parameters of the database update operation
     * @param {documents.BaseUser} user             The User who performed the update operation
     * @returns {Promise<void>}
     * @internal
     */
    static _onUpdateOperation(documents: Document[], operation: DatabaseUpdateOperation, user: documents.BaseUser): Promise<void>;
    /**
     * Pre-process a deletion operation, potentially altering its instructions or input data. Pre-operation events only
     * occur for the client which requested the operation.
     *
     * This batch-wise workflow occurs after individual {@link Document#_preDelete} workflows and provides a final
     * pre-flight check before a database operation occurs.
     *
     * Modifications to the requested deletions are performed by mutating the operation object.
     * {@link Document#updateSource}.
     *
     * @param {Document[]} documents                Document instances to be deleted
     * @param {DatabaseDeleteOperation} operation   Parameters of the database update operation
     * @param {documents.BaseUser} user             The User requesting the deletion operation
     * @returns {Promise<boolean|void>}             Return false to cancel the deletion operation entirely
     * @internal
     */
    static _preDeleteOperation(documents: Document[], operation: DatabaseDeleteOperation, user: documents.BaseUser): Promise<boolean | void>;
    /**
     * Post-process a deletion operation, reacting to database changes which have occurred. Post-operation events occur
     * for all connected clients.
     *
     * This batch-wise workflow occurs after individual {@link Document#_onDelete} workflows.
     *
     * @param {Document[]} documents                The Document instances which were deleted
     * @param {DatabaseDeleteOperation} operation   Parameters of the database deletion operation
     * @param {documents.BaseUser} user             The User who performed the deletion operation
     * @returns {Promise<void>}
     * @internal
     */
    static _onDeleteOperation(documents: Document[], operation: DatabaseDeleteOperation, user: documents.BaseUser): Promise<void>;
    /**
     * @deprecated since v11
     * @ignore
     */
    static get hasSystemData(): boolean;
    /**
     * A reusable helper for adding migration shims.
     * @protected
     * @ignore
     */
    protected static _addDataFieldShims(data: any, shims: any, options: any): void;
    /**
     * A reusable helper for adding a migration shim
     * @protected
     * @ignore
     */
    protected static _addDataFieldShim(data: any, oldKey: any, newKey: any, options?: {}): void;
    /**
     * Define a simple migration from one field name to another.
     * The value of the data can be transformed during the migration by an optional application function.
     * @param {object} data     The data object being migrated
     * @param {string} oldKey   The old field name
     * @param {string} newKey   The new field name
     * @param {function(data: object): any} [apply] An application function, otherwise the old value is applied
     * @returns {boolean}       Whether a migration was applied.
     * @internal
     */
    static _addDataFieldMigration(data: object, oldKey: string, newKey: string, apply: any): boolean;
    /** @protected */
    protected static _logDataFieldMigration(oldKey: any, newKey: any, options?: {}): void;
    /**
     * @deprecated since v12
     * @ignore
     */
    static _onCreateDocuments(documents: any, operation: any): Promise<void>;
    /**
     * @deprecated since v12
     * @ignore
     */
    static _onUpdateDocuments(documents: any, operation: any): Promise<void>;
    /**
     * @deprecated since v12
     * @ignore
     */
    static _onDeleteDocuments(documents: any, operation: any): Promise<void>;
    /** @override */
    override _configure({ pack, parentCollection }?: {
        pack?: any;
        parentCollection?: any;
    }): void;
    /** @inheritdoc */
    _initialize(options?: {}): void;
    get collectionName(): any;
    get documentName(): any;
    /**
     * Identify the collection in a parent Document that this Document belongs to, if any.
     * @param {string|null} [parentCollection]  An explicitly provided parent collection name.
     * @returns {string|null}
     * @internal
     */
    _getParentCollection(parentCollection?: string | null): string | null;
    /**
     * The canonical identifier for this Document.
     * @type {string|null}
     */
    get id(): string;
    /**
     * Test whether this Document is embedded within a parent Document
     * @type {boolean}
     */
    get isEmbedded(): boolean;
    /**
     * A Universally Unique Identifier (uuid) for this Document instance.
     * @type {string}
     */
    get uuid(): string;
    /**
     * Get the explicit permission level that a User has over this Document, a value in CONST.DOCUMENT_OWNERSHIP_LEVELS.
     * This method returns the value recorded in Document ownership, regardless of the User's role.
     * To test whether a user has a certain capability over the document, testUserPermission should be used.
     * @param {documents.BaseUser} user     The User being tested
     * @returns {number|null}               A numeric permission level from CONST.DOCUMENT_OWNERSHIP_LEVELS or null
     */
    getUserLevel(user: documents.BaseUser): number | null;
    /**
     * Test whether a certain User has a requested permission level (or greater) over the Document
     * @param {documents.BaseUser} user       The User being tested
     * @param {string|number} permission      The permission level from DOCUMENT_OWNERSHIP_LEVELS to test
     * @param {object} options                Additional options involved in the permission test
     * @param {boolean} [options.exact=false]     Require the exact permission level requested?
     * @return {boolean}                      Does the user have this permission level over the Document?
     */
    testUserPermission(user: documents.BaseUser, permission: string | number, { exact }?: {
        exact?: boolean;
    }): boolean;
    /**
     * Test whether a given User has permission to perform some action on this Document
     * @param {documents.BaseUser} user   The User attempting modification
     * @param {string} action             The attempted action
     * @param {object} [data]             Data involved in the attempted action
     * @return {boolean}                  Does the User have permission?
     */
    canUserModify(user: documents.BaseUser, action: string, data?: object): boolean;
    /**
     * Clone a document, creating a new document by combining current data with provided overrides.
     * The cloned document is ephemeral and not yet saved to the database.
     * @param {Object} [data={}]                         Additional data which overrides current document data at the time
     *                                                   of creation
     * @param {DocumentConstructionContext} [context={}] Additional context options passed to the create method
     * @param {boolean} [context.save=false]             Save the clone to the World database?
     * @param {boolean} [context.keepId=false]           Keep the same ID of the original document
     * @param {boolean} [context.addSource=false]        Track the clone source.
     * @returns {Document|Promise<Document>}             The cloned Document instance
     */
    clone(data?: any, { save, keepId, addSource, ...context }?: DocumentConstructionContext): Document | Promise<Document>;
    /**
     * For Documents which include game system data, migrate the system data object to conform to its latest data model.
     * The data model is defined by the template.json specification included by the game system.
     * @returns {object}              The migrated system data object
     */
    migrateSystemData(): object;
    /**
     * Update this Document using incremental data, saving it to the database.
     * @see Document.updateDocuments
     * @param {object} [data={}]          Differential update data which modifies the existing values of this document
     * @param {Partial<Omit<DatabaseUpdateOperation, "updates">>} [operation={}]  Parameters of the update operation
     * @returns {Promise<Document>}       The updated Document instance
     */
    update(data?: object, operation?: Partial<Omit<DatabaseUpdateOperation, "updates">>): Promise<Document>;
    /**
     * Delete this Document, removing it from the database.
     * @see Document.deleteDocuments
     * @param {Partial<Omit<DatabaseDeleteOperation, "ids">>} [operation={}]  Parameters of the deletion operation
     * @returns {Promise<Document>}       The deleted Document instance
     */
    delete(operation?: Partial<Omit<DatabaseDeleteOperation, "ids">>): Promise<Document>;
    /**
     * Obtain a reference to the Array of source data within the data object for a certain embedded Document name
     * @param {string} embeddedName   The name of the embedded Document type
     * @return {DocumentCollection}   The Collection instance of embedded Documents of the requested type
     */
    getEmbeddedCollection(embeddedName: string): DocumentCollection;
    /**
     * Get an embedded document by its id from a named collection in the parent document.
     * @param {string} embeddedName              The name of the embedded Document type
     * @param {string} id                        The id of the child document to retrieve
     * @param {object} [options]                 Additional options which modify how embedded documents are retrieved
     * @param {boolean} [options.strict=false]   Throw an Error if the requested id does not exist. See Collection#get
     * @param {boolean} [options.invalid=false]  Allow retrieving an invalid Embedded Document.
     * @return {Document}                        The retrieved embedded Document instance, or undefined
     * @throws If the embedded collection does not exist, or if strict is true and the Embedded Document could not be
     *         found.
     */
    getEmbeddedDocument(embeddedName: string, id: string, { invalid, strict }?: {
        strict?: boolean;
        invalid?: boolean;
    }): Document;
    /**
     * Create multiple embedded Document instances within this parent Document using provided input data.
     * @see Document.createDocuments
     * @param {string} embeddedName                     The name of the embedded Document type
     * @param {object[]} data                           An array of data objects used to create multiple documents
     * @param {DatabaseCreateOperation} [operation={}]  Parameters of the database creation workflow
     * @return {Promise<Document[]>}                    An array of created Document instances
     */
    createEmbeddedDocuments(embeddedName: string, data?: object[], operation?: DatabaseCreateOperation): Promise<Document[]>;
    /**
     * Update multiple embedded Document instances within a parent Document using provided differential data.
     * @see Document.updateDocuments
     * @param {string} embeddedName                     The name of the embedded Document type
     * @param {object[]} updates                        An array of differential data objects, each used to update a
     *                                                  single Document
     * @param {DatabaseUpdateOperation} [operation={}]  Parameters of the database update workflow
     * @return {Promise<Document[]>}                    An array of updated Document instances
     */
    updateEmbeddedDocuments(embeddedName: string, updates?: object[], operation?: DatabaseUpdateOperation): Promise<Document[]>;
    /**
     * Delete multiple embedded Document instances within a parent Document using provided string ids.
     * @see Document.deleteDocuments
     * @param {string} embeddedName                     The name of the embedded Document type
     * @param {string[]} ids                            An array of string ids for each Document to be deleted
     * @param {DatabaseDeleteOperation} [operation={}]  Parameters of the database deletion workflow
     * @return {Promise<Document[]>}                    An array of deleted Document instances
     */
    deleteEmbeddedDocuments(embeddedName: string, ids: string[], operation?: DatabaseDeleteOperation): Promise<Document[]>;
    /**
     * Iterate over all embedded Documents that are hierarchical children of this Document.
     * @param {string} [_parentPath]                      A parent field path already traversed
     * @returns {Generator<[string, Document]>}
     */
    traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document]>;
    /**
     * Get the value of a "flag" for this document
     * See the setFlag method for more details on flags
     *
     * @param {string} scope        The flag scope which namespaces the key
     * @param {string} key          The flag key
     * @return {*}                  The flag value
     */
    getFlag(scope: string, key: string): any;
    /**
     * Assign a "flag" to this document.
     * Flags represent key-value type data which can be used to store flexible or arbitrary data required by either
     * the core software, game systems, or user-created modules.
     *
     * Each flag should be set using a scope which provides a namespace for the flag to help prevent collisions.
     *
     * Flags set by the core software use the "core" scope.
     * Flags set by game systems or modules should use the canonical name attribute for the module
     * Flags set by an individual world should "world" as the scope.
     *
     * Flag values can assume almost any data type. Setting a flag value to null will delete that flag.
     *
     * @param {string} scope        The flag scope which namespaces the key
     * @param {string} key          The flag key
     * @param {*} value             The flag value
     * @return {Promise<Document>}  A Promise resolving to the updated document
     */
    setFlag(scope: string, key: string, value: any): Promise<Document>;
    /**
     * Remove a flag assigned to the document
     * @param {string} scope        The flag scope which namespaces the key
     * @param {string} key          The flag key
     * @return {Promise<Document>}  The updated document instance
     */
    unsetFlag(scope: string, key: string): Promise<Document>;
    /**
     * Pre-process a creation operation for a single Document instance. Pre-operation events only occur for the client
     * which requested the operation.
     *
     * Modifications to the pending Document instance must be performed using {@link Document#updateSource}.
     *
     * @param {object} data                         The initial data object provided to the document creation request
     * @param {object} options                      Additional options which modify the creation request
     * @param {documents.BaseUser} user             The User requesting the document creation
     * @returns {Promise<boolean|void>}             Return false to exclude this Document from the creation operation
     * @internal
     */
    _preCreate(data: object, options: object, user: documents.BaseUser): Promise<boolean | void>;
    /**
     * Post-process a creation operation for a single Document instance. Post-operation events occur for all connected
     * clients.
     *
     * @param {object} data                         The initial data object provided to the document creation request
     * @param {object} options                      Additional options which modify the creation request
     * @param {string} userId                       The id of the User requesting the document update
     * @internal
     */
    _onCreate(data: object, options: object, userId: string): void;
    /**
     * Pre-process an update operation for a single Document instance. Pre-operation events only occur for the client
     * which requested the operation.
     *
     * @param {object} changed            The differential data that is changed relative to the documents prior values
     * @param {object} options            Additional options which modify the update request
     * @param {documents.BaseUser} user   The User requesting the document update
     * @returns {Promise<boolean|void>}   A return value of false indicates the update operation should be cancelled.
     * @internal
     */
    _preUpdate(changed: object, options: object, user: documents.BaseUser): Promise<boolean | void>;
    /**
     * Post-process an update operation for a single Document instance. Post-operation events occur for all connected
     * clients.
     *
     * @param {object} changed            The differential data that was changed relative to the documents prior values
     * @param {object} options            Additional options which modify the update request
     * @param {string} userId             The id of the User requesting the document update
     * @internal
     */
    _onUpdate(changed: object, options: object, userId: string): void;
    /**
     * Pre-process a deletion operation for a single Document instance. Pre-operation events only occur for the client
     * which requested the operation.
     *
     * @param {object} options            Additional options which modify the deletion request
     * @param {documents.BaseUser} user   The User requesting the document deletion
     * @returns {Promise<boolean|void>}   A return value of false indicates the deletion operation should be cancelled.
     * @internal
     */
    _preDelete(options: object, user: documents.BaseUser): Promise<boolean | void>;
    /**
     * Post-process a deletion operation for a single Document instance. Post-operation events occur for all connected
     * clients.
     *
     * @param {object} options            Additional options which modify the deletion request
     * @param {string} userId             The id of the User requesting the document update
     * @internal
     */
    _onDelete(options: object, userId: string): void;
    /**
     * @deprecated since v10
     * @ignore
     */
    get data(): void;
}
import DataModel from "./data.mjs";
