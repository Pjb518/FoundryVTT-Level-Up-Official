/**
 * An embedded collection delta contains delta source objects that can be compared against other objects inside a base
 * embedded collection, and generate new embedded Documents by combining them.
 */
import EmbeddedCollection from './embedded-collection.d.mts';

export default class EmbeddedCollectionDelta extends EmbeddedCollection {
  /**
   * A convenience getter to return the corresponding base collection.
   * @type {EmbeddedCollection}
   */
  get baseCollection(): EmbeddedCollection;
  /**
   * A convenience getter to return the corresponding synthetic collection.
   * @type {EmbeddedCollection}
   */
  get syntheticCollection(): EmbeddedCollection;
  /** @override */
  override createDocument(data: any, context?: {}): import('./document.d.mts').default;
  /** @override */
  override initialize({ full, ...options }?: {
    full?: boolean;
  }): void;
  /** @override */
  override _initializeDocument(data: any, context: any): void;
  /** @override */
  override _createOrUpdate(data: any, options: any): void;
  /**
   * Determine whether a given ID is managed directly by this collection delta or inherited from the base collection.
   * @param {string} key  The Document ID.
   * @returns {boolean}
   */
  manages(key: string): boolean;
  /**
   * Determine whether a given ID exists as a tombstone Document in the collection delta.
   * @param {string} key  The Document ID.
   * @returns {boolean}
   */
  isTombstone(key: string): boolean;
  /**
   * Restore a Document so that it is no longer managed by the collection delta and instead inherits from the base
   * Document.
   * @param {string} id            The Document ID.
   * @returns {Promise<Document>}  The restored Document.
   */
  restoreDocument(id: string): Promise<Document>;
  /**
   * Restore the given Documents so that they are no longer managed by the collection delta and instead inherit directly
   * from their counterparts in the base Actor.
   * @param {string[]} ids           The IDs of the Documents to restore.
   * @returns {Promise<Document[]>}  An array of updated Document instances.
   */
  restoreDocuments(ids: string[]): Promise<Document[]>;
  /** @inheritdoc */
  set(key: any, value: any, options?: {}): void;
  /** @override */
  override _set(key: any, value: any, { restoreDelta }?: {
    restoreDelta?: boolean;
  }): void;
  /** @inheritdoc */
  delete(key: any, options?: {}): void;
  /** @override */
  override _delete(key: any, { restoreDelta }?: {
    restoreDelta?: boolean;
  }): void;
  #private;
}
