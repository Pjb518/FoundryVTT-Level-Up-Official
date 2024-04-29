/**
 * @typedef {import("./_types.d.mts").TableResultData} TableResultData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The TableResult Document.
 * Defines the DataSchema and common behaviors for a TableResult which are shared between both client and server.
 * @mixes TableResultData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseTableResult extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    type: fields.DocumentTypeField;
    text: fields.HTMLField;
    img: fields.FilePathField;
    documentCollection: fields.StringField;
    documentId: fields.ForeignDocumentField;
    weight: fields.NumberField;
    range: fields.ArrayField;
    drawn: fields.BooleanField;
    flags: fields.ObjectField;
  };
  /**
   * Is a user able to update an existing TableResult?
   * @private
   */
  private static '__#23@#canUpdate';
  /** @inheritdoc */
  static migrateData(data: any): any;
  /**
   * Construct a TableResult document using provided data and context.
   * @param {Partial<TableResultData>} data         Initial data from which to construct the TableResult
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<TableResultData>, context: DocumentConstructionContext);
  /** @inheritdoc */
  testUserPermission(user: any, permission: any, { exact }?: {
    exact?: boolean;
  }): any;
}
export type TableResultData = import('./_types.d.mts').TableResultData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
