/**
 * @typedef {import("./_types.mjs").PlaylistSoundData} PlaylistSoundData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The PlaylistSound Document.
 * Defines the DataSchema and common behaviors for a PlaylistSound which are shared between both client and server.
 * @mixes PlaylistSoundData
 */
export default class BasePlaylistSound extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        description: fields.StringField;
        path: fields.FilePathField;
        channel: fields.StringField;
        playing: fields.BooleanField;
        pausedTime: fields.NumberField;
        repeat: fields.BooleanField;
        volume: fields.AlphaField;
        fade: fields.NumberField;
        sort: fields.IntegerSortField;
        flags: fields.ObjectField;
    };
    /**
     * Construct a PlaylistSound document using provided data and context.
     * @param {Partial<PlaylistSoundData>} data       Initial data from which to construct the PlaylistSound
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<PlaylistSoundData>, context: DocumentConstructionContext);
    /** @inheritdoc */
    testUserPermission(user: any, permission: any, { exact }?: {
        exact?: boolean;
    }): any;
}
export type PlaylistSoundData = import("./_types.mjs").PlaylistSoundData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
