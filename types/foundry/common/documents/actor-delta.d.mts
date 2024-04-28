/**
 * @typedef {import("./_types.mjs").ActorDeltaData} ActorDeltaData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The ActorDelta Document.
 * Defines the DataSchema and common behaviors for an ActorDelta which are shared between both client and server.
 * ActorDeltas store a delta that can be applied to a particular Actor in order to produce a new Actor.
 * @mixes ActorDeltaData
 */
export default class BaseActorDelta extends Document {
    /** @override */
    static override defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        type: fields.StringField;
        img: fields.FilePathField;
        system: fields.ObjectField;
        items: fields.EmbeddedCollectionDeltaField;
        effects: fields.EmbeddedCollectionDeltaField;
        ownership: fields.DocumentOwnershipField;
        flags: fields.ObjectField;
    };
    /**
     * Apply an ActorDelta to an Actor and return the resultant synthetic Actor.
     * @param {ActorDelta} delta  The ActorDelta.
     * @param {Actor} baseActor   The base Actor.
     * @param {object} [context]  Context to supply to synthetic Actor instantiation.
     * @returns {Actor|null}
     */
    static applyDelta(delta: ActorDelta, baseActor: Actor, context?: object): Actor | null;
    /**
     * Merge delta Document embedded collections with the base Document.
     * @param {typeof Document} documentClass  The parent Document class.
     * @param {object} baseData                The base Document data.
     * @param {object} deltaData               The delta Document data.
     */
    static "__#15@#mergeEmbeddedCollections"(documentClass: typeof Document, baseData: object, deltaData: object): void;
    /**
     * Apply an embedded collection delta.
     * @param {object[]} base   The base embedded collection.
     * @param {object[]} delta  The delta embedded collection.
     * @returns {object[]}
     */
    static "__#15@#mergeEmbeddedCollection"(base?: object[], delta?: object[]): object[];
    /** @override */
    static override migrateData(source: any): any;
    /**
     * Construct an ActorDelta document using provided data and context.
     * @param {Partial<ActorDeltaData>} data         Initial data used to construct the ActorDelta.
     * @param {DocumentConstructionContext} context  Construction context options.
     */
    constructor(data: Partial<ActorDeltaData>, context: DocumentConstructionContext);
    /** @override */
    override canUserModify(user: any, action: any, data?: {}): any;
    /** @override */
    override testUserPermission(user: any, permission: any, { exact }?: {
        exact?: boolean;
    }): any;
    /**
     * Retrieve the base actor's collection, if it exists.
     * @param {string} collectionName  The collection name.
     * @returns {Collection}
     */
    getBaseCollection(collectionName: string): Collection;
    /** @override */
    override toObject(source?: boolean): {};
}
export type ActorDeltaData = import("./_types.mjs").ActorDeltaData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
