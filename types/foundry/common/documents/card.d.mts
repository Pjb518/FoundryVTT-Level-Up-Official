/**
 * @typedef {import("./_types.mjs").CardData} CardData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Card Document.
 * Defines the DataSchema and common behaviors for a Card which are shared between both client and server.
 * @mixes CardData
 */
export default class BaseCard extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        description: fields.HTMLField;
        type: fields.DocumentTypeField;
        system: fields.TypeDataField;
        suit: fields.StringField;
        value: fields.NumberField;
        back: fields.SchemaField;
        faces: fields.ArrayField;
        face: fields.NumberField;
        drawn: fields.BooleanField;
        origin: fields.ForeignDocumentField;
        width: fields.NumberField;
        height: fields.NumberField;
        rotation: fields.AngleField;
        sort: fields.IntegerSortField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /**
     * The default icon used for a Card face that does not have a custom image set
     * @type {string}
     */
    static DEFAULT_ICON: string;
    /**
     * Is a User able to create a new Card within this parent?
     * @private
     */
    private static "__#16@#canCreate";
    /**
     * Is a user able to update an existing Card?
     * @private
     */
    private static "__#16@#canUpdate";
    /**
     * Construct a Card document using provided data and context.
     * @param {Partial<CardData>} data                Initial data from which to construct the Card
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<CardData>, context: DocumentConstructionContext);
    /** @inheritdoc */
    testUserPermission(user: any, permission: any, { exact }?: {
        exact?: boolean;
    }): any;
}
export type CardData = import("./_types.mjs").CardData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
