/**
 * @typedef {import("./_types.d.mts").DrawingData} DrawingData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Drawing Document.
 * Defines the DataSchema and common behaviors for a Drawing which are shared between both client and server.
 * @mixes DrawingData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseDrawing extends Document {
  /** @inheritDoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    author: fields.ForeignDocumentField;
    shape: fields.EmbeddedDataField;
    x: fields.NumberField;
    y: fields.NumberField;
    elevation: fields.NumberField;
    sort: fields.NumberField;
    rotation: fields.AngleField;
    bezierFactor: fields.AlphaField;
    fillType: fields.NumberField;
    fillColor: fields.ColorField;
    fillAlpha: fields.AlphaField;
    strokeWidth: fields.NumberField;
    strokeColor: fields.ColorField;
    strokeAlpha: fields.AlphaField;
    texture: fields.FilePathField;
    text: fields.StringField;
    fontFamily: fields.StringField;
    fontSize: fields.NumberField;
    textColor: fields.ColorField;
    textAlpha: fields.AlphaField;
    hidden: fields.BooleanField;
    locked: fields.BooleanField;
    interface: fields.BooleanField;
    flags: fields.ObjectField;
  };
  /**
   * Validate whether the drawing has some visible content (as required by validation).
   * @returns {boolean}
   */
  static '__#20@#validateVisibleContent'(data: any): boolean;
  /** @inheritdoc */
  static validateJoint(data: any): void;
  /**
   * Is a user able to update or delete an existing Drawing document??
   * @private
   */
  private static '__#20@#canModify';
  /** @inheritdoc */
  static migrateData(data: any): any;
  /** @inheritdoc */
  static shimData(data: any, options: any): any;
  /**
   * Construct a Drawing document using provided data and context.
   * @param {Partial<DrawingData>} data             Initial data from which to construct the Drawing
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<DrawingData>, context: DocumentConstructionContext);
  /** @inheritdoc */
  testUserPermission(user: any, permission: any, { exact }?: {
    exact?: boolean;
  }): boolean;
  /**
   * @deprecated since v12
   * @ignore
   */
  get z(): any;
}
export type DrawingData = import('./_types.d.mts').DrawingData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
