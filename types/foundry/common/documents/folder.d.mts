/**
 * @typedef {import("./_types.mjs").FolderData} FolderData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Folder Document.
 * Defines the DataSchema and common behaviors for a Folder which are shared between both client and server.
 * @mixes FolderData
 */
export default class BaseFolder extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        type: fields.DocumentTypeField;
        description: fields.HTMLField;
        folder: fields.ForeignDocumentField;
        sorting: fields.StringField;
        sort: fields.IntegerSortField;
        color: fields.ColorField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /** @inheritdoc */
    static validateJoint(data: any): void;
    /**
     * Allow folder sorting modes
     * @type {string[]}
     */
    static SORTING_MODES: string[];
    /** @override */
    static override get(documentId: any, options?: {}): any;
    /**
     * Construct a Folder document using provided data and context.
     * @param {Partial<FolderData>} data              Initial data from which to construct the Folder
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<FolderData>, context: DocumentConstructionContext);
}
export type FolderData = import("./_types.mjs").FolderData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
