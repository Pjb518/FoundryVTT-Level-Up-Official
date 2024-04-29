/**
 * @typedef {import("./_types.d.mts").SettingData} SettingData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Setting Document.
 * Defines the DataSchema and common behaviors for a Setting which are shared between both client and server.
 * @mixes SettingData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

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
export type SettingData = import('./_types.d.mts').SettingData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
