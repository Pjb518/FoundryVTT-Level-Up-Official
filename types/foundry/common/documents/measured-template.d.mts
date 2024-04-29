/**
 * @typedef {import("./_types.d.mts").MeasuredTemplateData} MeasuredTemplateData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The MeasuredTemplate Document.
 * Defines the DataSchema and common behaviors for a MeasuredTemplate which are shared between both client and server.
 * @mixes MeasuredTemplateData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseMeasuredTemplate extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    author: fields.ForeignDocumentField;
    t: fields.StringField;
    x: fields.NumberField;
    y: fields.NumberField;
    elevation: fields.NumberField;
    sort: fields.NumberField;
    distance: fields.NumberField;
    direction: fields.AngleField;
    angle: fields.AngleField;
    width: fields.NumberField;
    borderColor: fields.ColorField;
    fillColor: fields.ColorField;
    texture: fields.FilePathField;
    hidden: fields.BooleanField;
    flags: fields.ObjectField;
  };
  /**
   * Is a user able to create a new MeasuredTemplate?
   * @param {User} user                     The user attempting the creation operation.
   * @param {BaseMeasuredTemplate} doc      The MeasuredTemplate being created.
   * @returns {boolean}
   * @private
   */
  private static '__#22@#canCreate';

  /**
   * Is a user able to modify an existing MeasuredTemplate?
   * @param {User} user                     The user attempting the modification.
   * @param {BaseMeasuredTemplate} doc      The MeasuredTemplate being modified.
   * @param {object} [data]                 Data being changed.
   * @returns {boolean}
   * @private
   */
  private static '__#22@#canModify';
  /** @inheritdoc */
  static migrateData(data: any): any;
  /** @inheritdoc */
  static shimData(data: any, options: any): any;
  /**
   * Construct a MeasuredTemplate document using provided data and context.
   * @param {Partial<MeasuredTemplateData>} data    Initial data from which to construct the MeasuredTemplate
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<MeasuredTemplateData>, context: DocumentConstructionContext);
  /** @inheritdoc */
  testUserPermission(user: any, permission: any, { exact }?: {
    exact?: boolean;
  }): boolean;
  /**
   * @deprecated since v12
   * @ignore
   */
  get user(): any;
}
export type MeasuredTemplateData = import('./_types.d.mts').MeasuredTemplateData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
