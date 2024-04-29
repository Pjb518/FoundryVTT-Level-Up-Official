/**
 * @typedef {import("./_types.d.mts").WallData} WallData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Wall Document.
 * Defines the DataSchema and common behaviors for a Wall which are shared between both client and server.
 * @mixes WallData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseWall extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    c: fields.ArrayField;
    light: fields.NumberField;
    move: fields.NumberField;
    sight: fields.NumberField;
    sound: fields.NumberField;
    dir: fields.NumberField;
    door: fields.NumberField;
    ds: fields.NumberField;
    doorSound: fields.StringField;
    threshold: fields.SchemaField;
    flags: fields.ObjectField;
  };
  /**
   * Is a user able to update an existing Wall?
   * @private
   */
  private static '__#26@#canUpdate';
  /**
   * Construct a Wall document using provided data and context.
   * @param {Partial<WallData>} data                Initial data from which to construct the Wall
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<WallData>, context: DocumentConstructionContext);
}
export type WallData = import('./_types.d.mts').WallData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
