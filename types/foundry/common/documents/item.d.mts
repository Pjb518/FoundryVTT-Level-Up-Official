/**
 * @typedef {import("./_types.d.mts").ItemData} ItemData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Item Document.
 * Defines the DataSchema and common behaviors for a Item which are shared between both client and server.
 * @mixes ItemData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseItem extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    name: fields.StringField;
    type: fields.DocumentTypeField;
    img: fields.FilePathField;
    system: fields.TypeDataField;
    effects: fields.EmbeddedCollectionField;
    folder: fields.ForeignDocumentField;
    sort: fields.IntegerSortField;
    ownership: fields.DocumentOwnershipField;
    flags: fields.ObjectField;
    _stats: fields.DocumentStatsField;
  };
  /**
   * The default icon used for newly created Item documents
   * @type {string}
   */
  static DEFAULT_ICON: string;
  /**
   * Determine default artwork based on the provided item data.
   * @param {ItemData} itemData  The source item data.
   * @returns {{img: string}}    Candidate item image.
   */
  static getDefaultArtwork(itemData: ItemData): {
    img: string;
  };
  /** @inheritDoc */
  static migrateData(source: any): any;
  /**
   * Construct a Item document using provided data and context.
   * @param {Partial<ItemData>} data                Initial data from which to construct the Item
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<ItemData>, context: DocumentConstructionContext);
  /** @inheritdoc */
  canUserModify(user: any, action: any, data?: {}): any;
  /** @inheritdoc */
  testUserPermission(user: any, permission: any, { exact }?: {
    exact?: boolean;
  }): any;
}
export type ItemData = import('./_types.d.mts').ItemData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
