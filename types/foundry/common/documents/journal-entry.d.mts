/**
 * @typedef {import("./_types.mjs").JournalEntryData} JournalEntryData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The JournalEntry Document.
 * Defines the DataSchema and common behaviors for a JournalEntry which are shared between both client and server.
 * @mixes JournalEntryData
 */
export default class BaseJournalEntry extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        pages: fields.EmbeddedCollectionField;
        folder: fields.ForeignDocumentField;
        sort: fields.IntegerSortField;
        ownership: fields.DocumentOwnershipField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /** @inheritDoc */
    static migrateData(source: any): any;
    /**
     * Construct a JournalEntry document using provided data and context.
     * @param {Partial<JournalEntryData>} data        Initial data from which to construct the JournalEntry
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<JournalEntryData>, context: DocumentConstructionContext);
}
export type JournalEntryData = import("./_types.mjs").JournalEntryData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
