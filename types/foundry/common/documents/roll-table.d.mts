/**
 * @typedef {import("./_types.mjs").RollTableData} RollTableData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The RollTable Document.
 * Defines the DataSchema and common behaviors for a RollTable which are shared between both client and server.
 * @mixes RollTableData
 */
export default class BaseRollTable extends Document {
    /** @inheritDoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        img: fields.FilePathField;
        description: fields.HTMLField;
        results: fields.EmbeddedCollectionField;
        formula: fields.StringField;
        replacement: fields.BooleanField;
        displayRoll: fields.BooleanField;
        folder: fields.ForeignDocumentField;
        sort: fields.IntegerSortField;
        ownership: fields.DocumentOwnershipField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /**
     * The default icon used for newly created Macro documents
     * @type {string}
     */
    static DEFAULT_ICON: string;
    /** @inheritDoc */
    static migrateData(source: any): any;
    /**
     * Construct a RollTable document using provided data and context.
     * @param {Partial<RollTableData>} data           Initial data from which to construct the RollTable
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<RollTableData>, context: DocumentConstructionContext);
}
export type RollTableData = import("./_types.mjs").RollTableData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
