/**
 * @typedef {import("./_types.mjs").AdventureData} AdventureData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Adventure Document.
 * Defines the DataSchema and common behaviors for an Adventure which are shared between both client and server.
 * @mixes AdventureData
 */
export default class BaseAdventure extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        img: fields.FilePathField;
        caption: fields.HTMLField;
        description: fields.HTMLField;
        actors: fields.SetField;
        combats: fields.SetField;
        items: fields.SetField;
        journal: fields.SetField;
        scenes: fields.SetField;
        tables: fields.SetField;
        macros: fields.SetField;
        cards: fields.SetField;
        playlists: fields.SetField;
        folders: fields.SetField;
        folder: fields.ForeignDocumentField;
        sort: fields.IntegerSortField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /**
     * An array of the fields which provide imported content from the Adventure.
     * @type {Record<string, typeof Document>}
     */
    static get contentFields(): Record<string, typeof Document>;
    /**
     * Construct an Adventure document using provided data and context.
     * @param {Partial<AdventureData>} data         Initial data used to construct the Adventure.
     * @param {DocumentConstructionContext} context  Construction context options.
     */
    constructor(data: Partial<AdventureData>, context: DocumentConstructionContext);
    /**
     * Provide a thumbnail image path used to represent the Adventure document.
     * @type {string}
     */
    get thumbnail(): string;
}
export type AdventureData = import("./_types.mjs").AdventureData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
