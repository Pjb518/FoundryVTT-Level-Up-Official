/**
 * @typedef {import("./_types.d.mts").AmbientLightData} AmbientLightData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The AmbientLight Document.
 * Defines the DataSchema and common behaviors for an AmbientLight which are shared between both client and server.
 * @mixes AmbientLightData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseAmbientLight extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    x: fields.NumberField;
    y: fields.NumberField;
    elevation: fields.NumberField;
    rotation: fields.AngleField;
    walls: fields.BooleanField;
    vision: fields.BooleanField;
    config: fields.EmbeddedDataField;
    hidden: fields.BooleanField;
    flags: fields.ObjectField;
  };
  /**
   * Construct an AmbientLight document using provided data and context.
   * @param {Partial<AmbientLightData>} data        Initial data from which to construct the AmbientLight
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<AmbientLightData>, context: DocumentConstructionContext);
}
export type AmbientLightData = import('./_types.d.mts').AmbientLightData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
