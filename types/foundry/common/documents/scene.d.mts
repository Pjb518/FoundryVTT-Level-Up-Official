/**
 * @typedef {import("./_types.mjs").SceneData} SceneData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Scene Document.
 * Defines the DataSchema and common behaviors for a Scene which are shared between both client and server.
 * @mixes SceneData
 */
export default class BaseScene extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        active: fields.BooleanField;
        navigation: fields.BooleanField;
        navOrder: fields.NumberField;
        navName: fields.HTMLField;
        background: TextureData;
        foreground: fields.FilePathField;
        foregroundElevation: fields.NumberField;
        thumb: fields.FilePathField;
        width: fields.NumberField;
        height: fields.NumberField;
        padding: fields.NumberField;
        initial: fields.SchemaField;
        backgroundColor: fields.ColorField;
        grid: fields.SchemaField;
        tokenVision: fields.BooleanField;
        fog: fields.SchemaField;
        environment: fields.SchemaField;
        drawings: fields.EmbeddedCollectionField;
        tokens: fields.EmbeddedCollectionField;
        lights: fields.EmbeddedCollectionField;
        notes: fields.EmbeddedCollectionField;
        sounds: fields.EmbeddedCollectionField;
        regions: fields.EmbeddedCollectionField;
        templates: fields.EmbeddedCollectionField;
        tiles: fields.EmbeddedCollectionField;
        walls: fields.EmbeddedCollectionField;
        playlist: fields.ForeignDocumentField;
        playlistSound: fields.ForeignDocumentField;
        journal: fields.ForeignDocumentField;
        journalEntryPage: fields.ForeignDocumentField;
        weather: fields.StringField;
        folder: fields.ForeignDocumentField;
        sort: fields.IntegerSortField;
        ownership: fields.DocumentOwnershipField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /** @inheritdoc */
    static migrateData(data: any): any;
    /** @inheritdoc */
    static shimData(data: any, options: any): any;
    /**
     * Construct a Scene document using provided data and context.
     * @param {Partial<SceneData>} data               Initial data from which to construct the Scene
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<SceneData>, context: DocumentConstructionContext);
}
export type SceneData = import("./_types.mjs").SceneData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
import { TextureData } from "../data/data.mjs";
