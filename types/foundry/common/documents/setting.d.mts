/**
 * @typedef {import("./_types.mjs").SettingData} SettingData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Setting Document.
 * Defines the DataSchema and common behaviors for a Setting which are shared between both client and server.
 * @mixes SettingData
 */
export default class BaseSetting extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        key: fields.StringField;
        value: fields.JSONField;
        _stats: fields.DocumentStatsField;
    };
    /**
     * Construct a Setting document using provided data and context.
     * @param {Partial<SettingData>} data             Initial data from which to construct the Setting
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<SettingData>, context: DocumentConstructionContext);
}
export type SettingData = import("./_types.mjs").SettingData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
