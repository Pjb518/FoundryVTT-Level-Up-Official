/**
 * @typedef {import("./_types.d.mts").RegionData} RegionData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Region Document.
 * Defines the DataSchema and common behaviors for a Region which are shared between both client and server.
 * @mixes RegionData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseRegion extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    name: fields.StringField;
    color: fields.ColorField;
    shapes: fields.ArrayField;
    elevation: fields.SchemaField;
    behaviors: fields.EmbeddedCollectionField;
    locked: fields.BooleanField;
    flags: fields.ObjectField;
  };
  /**
   * Construct a Region document using provided data and context.
   * @param {Partial<RegionData>} data         Initial data from which to construct the Region
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<RegionData>, context: DocumentConstructionContext);
}
export type RegionData = import('./_types.d.mts').RegionData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
