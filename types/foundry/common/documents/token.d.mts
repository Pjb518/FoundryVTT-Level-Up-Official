/**
 * @typedef {import("./_types.d.mts").TokenData} TokenData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Token Document.
 * Defines the DataSchema and common behaviors for a Token which are shared between both client and server.
 * @mixes TokenData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';
import { TextureData } from '../data/data.d.mts';

export default class BaseToken extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    name: fields.StringField;
    displayName: fields.NumberField;
    actorId: fields.ForeignDocumentField;
    actorLink: fields.BooleanField;
    delta: ActorDeltaField;
    appendNumber: fields.BooleanField;
    prependAdjective: fields.BooleanField;
    width: fields.NumberField;
    height: fields.NumberField;
    texture: TextureData;
    hexagonalShape: fields.NumberField;
    x: fields.NumberField;
    y: fields.NumberField;
    elevation: fields.NumberField;
    sort: fields.NumberField;
    locked: fields.BooleanField;
    lockRotation: fields.BooleanField;
    rotation: fields.AngleField;
    alpha: fields.AlphaField;
    hidden: fields.BooleanField;
    disposition: fields.NumberField;
    displayBars: fields.NumberField;
    bar1: fields.SchemaField;
    bar2: fields.SchemaField;
    light: fields.EmbeddedDataField;
    sight: fields.SchemaField;
    detectionModes: fields.ArrayField;
    occludable: fields.SchemaField;
    ring: fields.SchemaField;
    /** @internal */
    _regions: fields.ArrayField;
    flags: fields.ObjectField;
  };
  /**
   * Validate the structure of the detection modes array
   * @param {object[]} modes    Configured detection modes
   * @throws                    An error if the array is invalid
   */
  static '__#24@#validateDetectionModes'(modes: object[]): void;
  /**
   * The default icon used for newly created Token documents
   * @type {string}
   */
  static DEFAULT_ICON: string;

  /**
   * Is a user able to update an existing Token?
   * @private
   */
  private static '__#24@#canUpdate';
  /** @inheritDoc */
  static migrateData(data: any): any;
  /** @inheritdoc */
  static shimData(data: any, options: any): any;
  /**
   * Construct a Token document using provided data and context.
   * @param {Partial<TokenData>} data               Initial data from which to construct the Token
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<TokenData>, context: DocumentConstructionContext);
  /** @override */
  override testUserPermission(user: any, permission: any, { exact }?: {
    exact?: boolean;
  }): any;
  /** @inheritDoc */
  updateSource(changes?: {}, options?: {}): any;
  /**
   * @deprecated since v12
   * @ignore
   */
  get effects(): any[];
  /**
   * @deprecated since v12
   * @ignore
   */
  get overlayEffect(): string;
}
/**
 * A special subclass of EmbeddedDocumentField which allows construction of the ActorDelta to be lazily evaluated.
 */
export class ActorDeltaField extends fields.EmbeddedDocumentField {
}
export type TokenData = import('./_types.d.mts').TokenData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
