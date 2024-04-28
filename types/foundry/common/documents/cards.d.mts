/**
 * @typedef {import("./_types.mjs").CardsData} CardsData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Cards Document.
 * Defines the DataSchema and common behaviors for a Cards Document which are shared between both client and server.
 * @mixes CardsData
 */
export default class BaseCards extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        type: fields.DocumentTypeField;
        description: fields.HTMLField;
        img: fields.FilePathField;
        system: fields.TypeDataField;
        cards: fields.EmbeddedCollectionField;
        width: fields.NumberField;
        height: fields.NumberField;
        rotation: fields.AngleField;
        displayCount: fields.BooleanField;
        folder: fields.ForeignDocumentField;
        sort: fields.IntegerSortField;
        ownership: fields.DocumentOwnershipField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /**
     * The default icon used for a cards stack that does not have a custom image set
     * @type {string}
     */
    static DEFAULT_ICON: string;
    /** @inheritDoc */
    static migrateData(source: any): any;
    /**
     * Construct a Cards document using provided data and context.
     * @param {Partial<CardsData>} data               Initial data from which to construct the Cards
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<CardsData>, context: DocumentConstructionContext);
}
export type CardsData = import("./_types.mjs").CardsData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
