/**
 * @typedef {import("./_types.mjs").ActiveEffectData} ActiveEffectData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The ActiveEffect Document.
 * Defines the DataSchema and common behaviors for an ActiveEffect which are shared between both client and server.
 * @mixes {@link ActiveEffectData}
 */
export default class BaseActiveEffect extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        img: fields.FilePathField;
        type: fields.DocumentTypeField;
        system: fields.TypeDataField;
        changes: fields.ArrayField;
        disabled: fields.BooleanField;
        duration: fields.SchemaField;
        description: fields.HTMLField;
        origin: fields.StringField;
        tint: fields.ColorField;
        transfer: fields.BooleanField;
        statuses: fields.SetField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /** @inheritDoc */
    static migrateData(data: any): any;
    /** @inheritdoc */
    static shimData(data: any, options: any): any;
    /**
     * Construct an ActiveEffect document using provided data and context.
     * @param {Partial<ActiveEffectData>} data        Initial data from which to construct the ActiveEffect
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<ActiveEffectData>, context: DocumentConstructionContext);
    /** @inheritdoc */
    canUserModify(user: any, action: any, data?: {}): any;
    /** @inheritdoc */
    testUserPermission(user: any, permission: any, { exact }?: {
        exact?: boolean;
    }): any;
    /** @inheritDoc */
    _preCreate(data: any, options: any, user: any): Promise<boolean>;
    /**
     * @deprecated since v11
     * @ignore
     */
    set label(value: any);
    /**
     * @deprecated since v11
     * @ignore
     */
    get label(): any;
    name: any;
    /**
     * @deprecated since v12
     * @ignore
     */
    set icon(value: any);
    /**
     * @deprecated since v12
     * @ignore
     */
    get icon(): any;
    img: any;
}
export type ActiveEffectData = import("./_types.mjs").ActiveEffectData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
