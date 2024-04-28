/**
 * @typedef {import("./_types.mjs").JournalEntryPageData} JournalEntryPageData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The JournalEntryPage Document.
 * Defines the DataSchema and common behaviors for a JournalEntryPage which are shared between both client and server.
 * @mixes JournalEntryPageData
 */
export default class BaseJournalEntryPage extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        type: fields.DocumentTypeField;
        system: fields.TypeDataField;
        title: fields.SchemaField;
        image: fields.SchemaField;
        text: fields.SchemaField;
        video: fields.SchemaField;
        src: fields.StringField;
        sort: fields.IntegerSortField;
        ownership: fields.DocumentOwnershipField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /**
     * Construct a JournalEntryPage document using provided data and context.
     * @param {Partial<JournalEntryPageData>} data    Initial data from which to construct the JournalEntryPage
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<JournalEntryPageData>, context: DocumentConstructionContext);
    /** @inheritdoc */
    getUserLevel(user: any): any;
}
export type JournalEntryPageData = import("./_types.mjs").JournalEntryPageData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
