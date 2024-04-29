/**
 * @typedef {import("./string-tree.d.mts").StringTreeNode} StringTreeNode
 */
/**
 * A leaf entry in the tree.
 * @typedef {object} WordTreeEntry
 * @property {Document|object} entry  An object that this entry represents.
 * @property {string} documentName    The document type.
 * @property {string} uuid            The document's UUID.
 * @property {string} [pack]          The pack ID.
 */
/**
 * A data structure for quickly retrieving objects by a string prefix.
 * Note that this works well for languages with alphabets (latin, cyrillic, korean, etc.), but may need more nuanced
 * handling for languages that compose characters and letters.
 * @extends {StringTree}
 */
import StringTree from './string-tree.d.mts';

export default class WordTree extends StringTree {
  /**
   * Insert an entry into the tree.
   * @param {string} string        The string key for the entry.
   * @param {WordTreeEntry} entry  The entry to store.
   * @returns {StringTreeNode}     The node the entry was added to.
   */
  addLeaf(string: string, entry: WordTreeEntry): StringTreeNode;
  /**
   * Return entries that match the given string prefix.
   * @param {string} prefix              The prefix.
   * @param {object} [options]           Additional options to configure behaviour.
   * @param {number} [options.limit=10]  The maximum number of items to retrieve. It is important to set this value as
   *                                     very short prefixes will naturally match large numbers of entries.
   * @returns {WordTreeEntry[]}          A number of entries that have the given prefix.
   */
  lookup(prefix: string, { limit }?: {
    limit?: number;
  }): WordTreeEntry[];
  /**
   * Returns the node at the given prefix.
   * @param {string} prefix  The prefix.
   * @returns {StringTreeNode}
   */
  nodeAtPrefix(prefix: string): StringTreeNode;
}
export type StringTreeNode = import('./string-tree.d.mts').StringTreeNode;
/**
 * A leaf entry in the tree.
 */
export type WordTreeEntry = {
  /**
   * An object that this entry represents.
   */
  entry: Document | object;
  /**
   * The document type.
   */
  documentName: string;
  /**
   * The document's UUID.
   */
  uuid: string;
  /**
   * The pack ID.
   */
  pack?: string;
};
