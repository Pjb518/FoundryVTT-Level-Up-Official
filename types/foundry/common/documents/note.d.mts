/**
 * @typedef {import("./_types.mjs").NoteData} NoteData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Note Document.
 * Defines the DataSchema and common behaviors for a Note which are shared between both client and server.
 * @mixes NoteData
 */
export default class BaseNote extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        entryId: fields.ForeignDocumentField;
        pageId: fields.ForeignDocumentField;
        x: fields.NumberField;
        y: fields.NumberField;
        elevation: fields.NumberField;
        sort: fields.NumberField;
        texture: TextureData;
        iconSize: fields.NumberField;
        text: fields.StringField;
        fontFamily: fields.StringField;
        fontSize: fields.NumberField;
        textAnchor: fields.NumberField;
        textColor: fields.ColorField;
        global: fields.BooleanField;
        flags: fields.ObjectField;
    };
    /**
     * The default icon used for newly created Note documents.
     * @type {string}
     */
    static DEFAULT_ICON: string;
    /**
     * Construct a Note document using provided data and context.
     * @param {Partial<NoteData>} data                Initial data from which to construct the Note
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<NoteData>, context: DocumentConstructionContext);
    /** @inheritdoc */
    testUserPermission(user: any, permission: any, { exact }?: {
        exact?: boolean;
    }): any;
}
export type NoteData = import("./_types.mjs").NoteData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
import { TextureData } from "../data/data.mjs";
