/**
 * @typedef {import("./_types.d.mts").PlaylistSoundData} PlaylistSoundData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The PlaylistSound Document.
 * Defines the DataSchema and common behaviors for a PlaylistSound which are shared between both client and server.
 * @mixes PlaylistSoundData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BasePlaylistSound extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    name: fields.StringField;
    description: fields.StringField;
    path: fields.FilePathField;
    channel: fields.StringField;
    playing: fields.BooleanField;
    pausedTime: fields.NumberField;
    repeat: fields.BooleanField;
    volume: fields.AlphaField;
    fade: fields.NumberField;
    sort: fields.IntegerSortField;
    flags: fields.ObjectField;
  };
  /**
   * Construct a PlaylistSound document using provided data and context.
   * @param {Partial<PlaylistSoundData>} data       Initial data from which to construct the PlaylistSound
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<PlaylistSoundData>, context: DocumentConstructionContext);
  /** @inheritdoc */
  testUserPermission(user: any, permission: any, { exact }?: {
    exact?: boolean;
  }): any;
}
export type PlaylistSoundData = import('./_types.d.mts').PlaylistSoundData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
