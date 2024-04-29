/**
 * @typedef {import("./_types.d.mts").TileData} TileData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Tile Document.
 * Defines the DataSchema and common behaviors for a Tile which are shared between both client and server.
 * @mixes TileData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';
import { TextureData } from '../data/data.d.mts';

export default class BaseTile extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    texture: TextureData;
    width: fields.NumberField;
    height: fields.NumberField;
    x: fields.NumberField;
    y: fields.NumberField;
    elevation: fields.NumberField;
    sort: fields.NumberField;
    rotation: fields.AngleField;
    alpha: fields.AlphaField;
    hidden: fields.BooleanField;
    locked: fields.BooleanField;
    restrictions: fields.SchemaField;
    occlusion: fields.SchemaField;
    video: fields.SchemaField;
    flags: fields.ObjectField;
  };
  /** @inheritdoc */
  static migrateData(data: any): any;
  /** @inheritdoc */
  static shimData(data: any, options: any): any;
  /**
   * Construct a Tile document using provided data and context.
   * @param {Partial<TileData>} data                Initial data from which to construct the Tile
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<TileData>, context: DocumentConstructionContext);
  /**
   * @deprecated since v12
   * @ignore
   */
  set roof(enabled: any);
  /**
   * @deprecated since v12
   * @ignore
   */
  get roof(): any;
  /**
   * @deprecated since v12
   * @ignore
   */
  get z(): any;
  /**
   * @deprecated since v12
   * @ignore
   */
  get overhead(): boolean;
}
export type TileData = import('./_types.d.mts').TileData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
