/**
 * @typedef {import("./_types.mjs").AmbientSoundData} AmbientSoundData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The AmbientSound Document.
 * Defines the DataSchema and common behaviors for an AmbientSound which are shared between both client and server.
 * @mixes AmbientSoundData
 */
export default class BaseAmbientSound extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        x: fields.NumberField;
        y: fields.NumberField;
        elevation: fields.NumberField;
        radius: fields.NumberField;
        path: fields.FilePathField;
        repeat: fields.BooleanField;
        volume: fields.AlphaField;
        walls: fields.BooleanField;
        easing: fields.BooleanField;
        hidden: fields.BooleanField;
        darkness: fields.SchemaField;
        effects: fields.SchemaField;
        flags: fields.ObjectField;
    };
    /**
     * Construct an AmbientSound document using provided data and context.
     * @param {Partial<AmbientSoundData>} data        Initial data from which to construct the AmbientSound
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<AmbientSoundData>, context: DocumentConstructionContext);
}
export type AmbientSoundData = import("./_types.mjs").AmbientSoundData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
