/**
 * @typedef {import("./_types.d.mts").RegionBehaviorData} RegionBehaviorData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The RegionBehavior Document.
 * Defines the DataSchema and common behaviors for a RegionBehavior which are shared between both client and server.
 * @mixes SceneRegionData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseRegionBehavior extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    name: fields.StringField;
    type: fields.DocumentTypeField;
    system: fields.TypeDataField;
    disabled: fields.BooleanField;
    flags: fields.ObjectField;
    _stats: fields.DocumentStatsField;
  };
  /**
   * Construct a RegionBehavior document using provided data and context.
   * @param {Partial<RegionBehaviorData>} data    Initial data from which to construct the RegionBehavior
   * @param {DocumentConstructionContext} context      Construction context options
   */
  constructor(data: Partial<RegionBehaviorData>, context: DocumentConstructionContext);
}
export type RegionBehaviorData = import('./_types.d.mts').RegionBehaviorData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
