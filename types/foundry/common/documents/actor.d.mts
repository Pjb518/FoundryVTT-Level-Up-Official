/**
 * @typedef {import("./_types.d.mts").ActorData} ActorData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Actor Document.
 * Defines the DataSchema and common behaviors for an Actor which are shared between both client and server.
 * @mixes ActorData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseActor extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    name: fields.StringField;
    img: fields.FilePathField;
    type: fields.DocumentTypeField;
    system: fields.TypeDataField;
    prototypeToken: fields.EmbeddedDataField;
    items: fields.EmbeddedCollectionField;
    effects: fields.EmbeddedCollectionField;
    folder: fields.ForeignDocumentField;
    sort: fields.IntegerSortField;
    ownership: fields.DocumentOwnershipField;
    flags: fields.ObjectField;
    _stats: fields.DocumentStatsField;
  };
  /**
   * The default icon used for newly created Actor documents.
   * @type {string}
   */
  static DEFAULT_ICON: string;

  /**
   * Determine default artwork based on the provided actor data.
   * @param {ActorData} actorData                      The source actor data.
   * @returns {{img: string, texture: {src: string}}}  Candidate actor image and prototype token artwork.
   */
  static getDefaultArtwork(actorData: ActorData): {
    img: string;
    texture: {
      src: string;
    };
  };
  /** @inheritdoc */
  static canUserCreate(user: any): any;
  /**
   * Is a user able to create this actor?
   * @param {User} user  The user attempting the creation operation.
   * @param {Actor} doc  The Actor being created.
   * @private
   */
  private static '__#14@#canCreate';

  /**
   * Is a user able to update an existing actor?
   * @param {User} user    The user attempting the update operation.
   * @param {Actor} doc    The Actor being updated.
   * @param {object} data  The update delta being applied.
   * @private
   */
  private static '__#14@#canUpdate';
  /** @inheritDoc */
  static migrateData(source: any): any;
  /**
   * Construct an Actor document using provided data and context.
   * @param {Partial<ActorData>} data               Initial data from which to construct the Actor
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<ActorData>, context: DocumentConstructionContext);
  /** @inheritdoc */
  _initializeSource(source: any, options: any): any;
  /** @inheritDoc */
  _preCreate(data: any, options: any, user: any): Promise<boolean>;
  /** @inheritDoc */
  _preUpdate(changed: any, options: any, user: any): Promise<boolean>;
}
export type ActorData = import('./_types.d.mts').ActorData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
