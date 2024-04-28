/**
 * @typedef {import("./_types.mjs").FogExplorationData} FogExplorationData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The FogExploration Document.
 * Defines the DataSchema and common behaviors for a FogExploration which are shared between both client and server.
 * @mixes FogExplorationData
 */
export default class BaseFogExploration extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        scene: fields.ForeignDocumentField;
        user: fields.ForeignDocumentField;
        explored: fields.FilePathField;
        positions: fields.ObjectField;
        timestamp: fields.NumberField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /**
     * Test whether a User can modify a FogExploration document.
     */
    static "__#21@#canModify"(user: any, doc: any): any;
    /**
     * Construct a FogExploration document using provided data and context.
     * @param {Partial<FogExplorationData>} data      Initial data from which to construct the FogExploration
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<FogExplorationData>, context: DocumentConstructionContext);
    /** @inheritDoc */
    _preUpdate(changed: any, options: any, user: any): Promise<boolean>;
}
export type FogExplorationData = import("./_types.mjs").FogExplorationData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
