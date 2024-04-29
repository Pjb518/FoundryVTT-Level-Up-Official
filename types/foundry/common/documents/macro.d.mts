/**
 * @typedef {import("./_types.d.mts").MacroData} MacroData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Macro Document.
 * Defines the DataSchema and common behaviors for a Macro which are shared between both client and server.
 * @mixes MacroData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseMacro extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    name: fields.StringField;
    type: fields.DocumentTypeField;
    author: fields.ForeignDocumentField;
    img: fields.FilePathField;
    scope: fields.StringField;
    command: fields.StringField;
    folder: fields.ForeignDocumentField;
    sort: fields.IntegerSortField;
    ownership: fields.DocumentOwnershipField;
    flags: fields.ObjectField;
    _stats: fields.DocumentStatsField;
  };
  /**
   * The default icon used for newly created Macro documents.
   * @type {string}
   */
  static DEFAULT_ICON: string;
  /** @inheritDoc */
  static migrateData(source: any): any;
  /** @override */
  static override validateJoint(data: any): void;
  /**
   * Construct a Macro document using provided data and context.
   * @param {Partial<MacroData>} data               Initial data from which to construct the Macro
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<MacroData>, context: DocumentConstructionContext);
  /** @inheritdoc */
  testUserPermission(user: any, permission: any, { exact }?: {
    exact?: boolean;
  }): boolean;
  /** @inheritDoc */
  _preCreate(data: any, options: any, user: any): Promise<boolean>;
}
export type MacroData = import('./_types.d.mts').MacroData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
