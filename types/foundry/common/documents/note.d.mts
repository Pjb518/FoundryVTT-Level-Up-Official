/**
 * @typedef {import("./_types.d.mts").NoteData} NoteData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Note Document.
 * Defines the DataSchema and common behaviors for a Note which are shared between both client and server.
 * @mixes NoteData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';
import { TextureData } from '../data/data.d.mts';

export default class BaseNote extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    entryId: fields.ForeignDocumentField;
    pageId: fields.ForeignDocumentField;
    x: fields.NumberField;
    y: fields.NumberField;
    elevation: fields.NumberField;
    sort: fields.NumberField;
    texture: TextureData;
    iconSize: fields.NumberField;
    text: fields.StringField;
    fontFamily: fields.StringField;
    fontSize: fields.NumberField;
    textAnchor: fields.NumberField;
    textColor: fields.ColorField;
    global: fields.BooleanField;
    flags: fields.ObjectField;
  };
  /**
   * The default icon used for newly created Note documents.
   * @type {string}
   */
  static DEFAULT_ICON: string;
  /**
   * Construct a Note document using provided data and context.
   * @param {Partial<NoteData>} data                Initial data from which to construct the Note
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<NoteData>, context: DocumentConstructionContext);
  /** @inheritdoc */
  testUserPermission(user: any, permission: any, { exact }?: {
    exact?: boolean;
  }): any;
}
export type NoteData = import('./_types.d.mts').NoteData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
