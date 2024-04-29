/**
 * This class provides a {@link Collection} wrapper around a singleton embedded Document so that it can be interacted
 * with via a common interface.
 */
import EmbeddedCollection from './embedded-collection.d.mts';

export default class SingletonEmbeddedCollection extends EmbeddedCollection {
  /** @inheritdoc */
  set(key: any, value: any): this;
  /** @override */
  override _set(key: any, value: any): void;
  /** @override */
  override _delete(key: any): void;
}
