/**
 * A specialized subclass of DataModel, intended to represent a Document's type-specific data.
 * Systems or Modules that provide DataModel implementations for sub-types of Documents (such as Actors or Items)
 * should subclass this class instead of the base DataModel class.
 *
 * @see {@link Document}
 * @extends {DataModel}
 * @abstract
 *
 * @example Registering a custom sub-type for a Module.
 *
 * **module.json**
 * ```json
 * {
 *   "id": "my-module",
 *   "esmodules": ["main.mjs"],
 *   "documentTypes": {
 *     "Actor": {
 *       "sidekick": {},
 *       "villain": {}
 *     },
 *     "JournalEntryPage": {
 *       "dossier": {},
 *       "quest": {
 *         "htmlFields": ["description"]
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * **main.mjs**
 * ```js
 * Hooks.on("init", () => {
 *   Object.assign(CONFIG.Actor.dataModels, {
 *     "my-module.sidekick": SidekickModel,
 *     "my-module.villain": VillainModel
 *   });
 *   Object.assign(CONFIG.JournalEntryPage.dataModels, {
 *     "my-module.dossier": DossierModel,
 *     "my-module.quest": QuestModel
 *   });
 * });
 *
 * class QuestModel extends foundry.abstract.TypeDataModel {
 *   static defineSchema() {
 *     const fields = foundry.data.fields;
 *     return {
 *       description: new fields.HTMLField({required: false, blank: true, initial: ""}),
 *       steps: new fields.ArrayField(new fields.StringField())
 *     };
 *   }
 *
 *   prepareDerivedData() {
 *     this.totalSteps = this.steps.length;
 *   }
 * }
 * ```
 */
export default class TypeDataModel extends DataModel {
    /**
     * A set of localization prefix paths which are used by this data model.
     * @type {string[]}
     */
    static LOCALIZATION_PREFIXES: string[];
    /** @inheritdoc */
    constructor(data?: {}, options?: {});
    /**
     * Prepare data related to this DataModel itself, before any derived data is computed.
     *
     * Called before {@link ClientDocument#prepareBaseData} in {@link ClientDocument#prepareData}.
     */
    prepareBaseData(): void;
    /**
     * Apply transformations of derivations to the values of the source data object.
     * Compute data fields whose values are not stored to the database.
     *
     * Called before {@link ClientDocument#prepareDerivedData} in {@link ClientDocument#prepareData}.
     */
    prepareDerivedData(): void;
    /**
     * Convert this Document to some HTML display for embedding purposes.
     * @param {DocumentHTMLEmbedConfig} config  Configuration for embedding behavior.
     * @param {EnrichmentOptions} [options]     The original enrichment options for cases where the Document embed content
     *                                          also contains text that must be enriched.
     * @returns {Promise<HTMLElement|HTMLCollection|null>}
     */
    toEmbed(config: DocumentHTMLEmbedConfig, options?: EnrichmentOptions): Promise<HTMLElement | HTMLCollection | null>;
    /**
     * Called by {@link ClientDocument#_preCreate}.
     *
     * @param {object} data                         The initial data object provided to the document creation request
     * @param {object} options                      Additional options which modify the creation request
     * @param {documents.BaseUser} user             The User requesting the document creation
     * @returns {Promise<boolean|void>}             Return false to exclude this Document from the creation operation
     * @internal
     */
    _preCreate(data: object, options: object, user: documents.BaseUser): Promise<boolean | void>;
    /**
     * Called by {@link ClientDocument#_onCreate}.
     *
     * @param {object} data                         The initial data object provided to the document creation request
     * @param {object} options                      Additional options which modify the creation request
     * @param {string} userId                       The id of the User requesting the document update
     * @protected
     * @internal
     */
    protected _onCreate(data: object, options: object, userId: string): void;
    /**
     * Called by {@link ClientDocument#_preUpdate}.
     *
     * @param {object} changed            The differential data that is changed relative to the documents prior values
     * @param {object} options            Additional options which modify the update request
     * @param {documents.BaseUser} user   The User requesting the document update
     * @returns {Promise<boolean|void>}   A return value of false indicates the update operation should be cancelled.
     * @protected
     * @internal
     */
    protected _preUpdate(changed: object, options: object, user: documents.BaseUser): Promise<boolean | void>;
    /**
     * Called by {@link ClientDocument#_onUpdate}.
     *
     * @param {object} changed            The differential data that was changed relative to the documents prior values
     * @param {object} options            Additional options which modify the update request
     * @param {string} userId             The id of the User requesting the document update
     * @protected
     * @internal
     */
    protected _onUpdate(changed: object, options: object, userId: string): void;
    /**
     * Called by {@link ClientDocument#_preDelete}.
     *
     * @param {object} options            Additional options which modify the deletion request
     * @param {documents.BaseUser} user   The User requesting the document deletion
     * @returns {Promise<boolean|void>}   A return value of false indicates the deletion operation should be cancelled.
     * @protected
     * @internal
     */
    protected _preDelete(options: object, user: documents.BaseUser): Promise<boolean | void>;
    /**
     * Called by {@link ClientDocument#_onDelete}.
     *
     * @param {object} options            Additional options which modify the deletion request
     * @param {string} userId             The id of the User requesting the document update
     * @protected
     * @internal
     */
    protected _onDelete(options: object, userId: string): void;
}
import DataModel from "./data.mjs";
