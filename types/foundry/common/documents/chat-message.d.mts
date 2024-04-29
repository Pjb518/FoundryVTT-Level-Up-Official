/**
 * @typedef {import("./_types.d.mts").ChatMessageData} ChatMessageData
 * @typedef {import("../types.d.mts").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The ChatMessage Document.
 * Defines the DataSchema and common behaviors for a ChatMessage which are shared between both client and server.
 * @mixes ChatMessageData
 */
import Document from '../abstract/document.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseChatMessage extends Document {
  /** @inheritdoc */
  static defineSchema(): {
    _id: fields.DocumentIdField;
    type: fields.DocumentTypeField;
    system: fields.TypeDataField;
    style: fields.NumberField;
    author: fields.ForeignDocumentField;
    timestamp: fields.NumberField;
    flavor: fields.HTMLField;
    content: fields.HTMLField;
    speaker: fields.SchemaField;
    whisper: fields.ArrayField;
    blind: fields.BooleanField;
    rolls: fields.ArrayField;
    sound: fields.FilePathField;
    emote: fields.BooleanField;
    flags: fields.ObjectField;
    _stats: fields.DocumentStatsField;
  };
  /**
   * Is a user able to create a new chat message?
   * @private
   */
  private static '__#17@#canCreate';

  /**
   * Is a user able to update an existing chat message?
   * @private
   */
  private static '__#17@#canUpdate';

  /**
   * Is a user able to delete an existing chat message?
   * @private
   */
  private static '__#17@#canDelete';
  /**
   * Validate that Rolls belonging to the ChatMessage document are valid
   * @param {string} rollJSON     The serialized Roll data
   */
  static '__#17@#validateRoll'(rollJSON: string): void;
  /** @inheritdoc */
  static migrateData(data: any): any;
  /**
   * Migrate the type field to the style field in order to allow the type field to be used for system sub-types.
   * @param {Partial<ChatMessageData>} data
   */
  static '__#17@#migrateTypeToStyle'(data: Partial<ChatMessageData>): void;
  /** @inheritdoc */
  static shimData(data: any, options: any): any;
  /**
   * Construct a Cards document using provided data and context.
   * @param {Partial<ChatMessageData>} data         Initial data from which to construct the ChatMessage
   * @param {DocumentConstructionContext} context   Construction context options
   */
  constructor(data: Partial<ChatMessageData>, context: DocumentConstructionContext);
  /**
   * @deprecated since v12
   * @ignore
   */
  get user(): any;
}
export type ChatMessageData = import('./_types.d.mts').ChatMessageData;
export type DocumentConstructionContext = import('../types.d.mts').DocumentConstructionContext;
