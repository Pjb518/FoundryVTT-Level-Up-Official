/**
 * @typedef {Object} DocumentLinkReference
 * @property {String} uuid The Foundry document `id`
 */

export default class LinkedDocumentsHelper {
  #container;

  #propertyName;

  #validate;

  #duplicateWarning = 'A5E.DuplicateLinkedDocumentsWarning';

  #validateWarning = 'A5E.InvalidLinkedDocumentsWarning';

  /**
   * Helps with the management of an `Item` which has a bundle of linked documents.
   *
   * @param {Item} container The foundry `Item` which contains bundle of linked elements
   * @param {String} propertyName The property name of `container` for the bundle of linked
   * documents. (i.e. features = item.system.features)
   * @param {Object=} options A list of optional parameters
   * @param {Function} options.validate Defines a callback which to use filter which invalid items
   * @param {String} [options.validateWarning='A5E.DuplicateLinkedDocumentsWarning']
   * An i18n string for ui warning to show when an item doesn't pass `options.validate`
   * @param {String} [options.duplicateWarning='A5E.InvalidLinkedDocumentsWarning']
   * An i18n string for ui warning when duplicate item is being added
   */
  constructor(container, propertyName, options) {
    if (!(container instanceof Item)) throw Error('LinkedDocumentsHelper: container must be an instance of Item!');
    if (typeof propertyName !== 'string') throw Error('LinkedDocumentsHelper: propertyName is required!');
    if (typeof container.system[propertyName] !== 'object') throw Error(`LinkedDocumentsHelper: container must have 'system.${propertyName}'`);

    this.#container = container;
    this.#propertyName = propertyName;

    if (options) {
      const { validate, validateWarning, duplicateWarning } = options;

      if (typeof validate === 'function') this.#validate = validate;
      if (typeof validateWarning === 'string') this.#validateWarning = validateWarning;
      if (typeof duplicateWarning === 'string') this.#duplicateWarning = duplicateWarning;
    }
  }

  /**
   * Adds a new linked document
   *
   * @param {DocumentLinkReference} linkRef
   * @returns {Boolean} `true` if added.
   */
  async add(linkedDocumentReference) {
    return this.#add(linkedDocumentReference);
  }

  /**
   * Replaces the linked document with a uuid of `targetUuid` with `replacement`
   *
   * @param {String} targetUuid The UUID of the element to replace.
   * @param {DocumentLinkReference} replacement
   * The new element to inject at `targetUuid`'s location
   * @returns {Boolean} `true` if replaced
   */
  async replace(targetUuid, replacement) {
    return this.#add(replacement, this.getLinkedPropertyKey(targetUuid));
  }

  /**
   * Removes a linked document with `uuid`
   *
   * @param {String} uuid
   * @returns {Boolean} `true` if removed
   */
  async remove(uuid) {
    const key = this.getLinkedPropertyKey(uuid);
    if (key) {
      await this.#container.update({ [`system.${this.#propertyName}.-=${key}`]: null });
      return true;
    }
    return false;
  }

  /**
   * Finds the Linked Document with `uuid`
   *
   * @param {String} uuid
   * @returns {Object|Null}
   */
  find(uuid) {
    const key = this.getLinkedPropertyKey(uuid);
    return key ? this.linkedDocuments[key] : null;
  }

  get linkedDocuments() {
    return this.#container.system[this.#propertyName];
  }

  /**
   * The random linkedDocuments property for element with `uuid`
   *
   * @param {String} uuid Foundry's item id
   * @returns {String|Undefined}
   */
  getLinkedPropertyKey(uuid) {
    const entry = Object.entries(this.linkedDocuments).find(
      // eslint-disable-next-line no-unused-vars
      ([_, value]) => value.uuid === uuid
    );
    return entry ? entry[0] : undefined;
  }

  /**
   * Tests if `linkedDocument` can added, and adds it.
   *
   * @param {DocumentLinkReference} linkedDocument The document reference to add
   * @param {String=} replacementTarget The key on `this.linkedDocuments` where to insert
   * `linkedDocument. If none is provided, it generates a new key value.
   * @returns {Boolean} `true` if added.
   */
  async #add(linkedDocument, replacementTarget) {
    // Check we don't already have this feature added.
    const duplicate = this.getLinkedPropertyKey(linkedDocument.uuid);
    if (duplicate) {
      ui.notifications.warn(game.i18n.localize(this.#duplicateWarning));
      return false;
    }

    if (this.#validate) {
      const obj = await fromUuid(linkedDocument.uuid);
      if (!this.#validate(obj)) {
        ui.notifications.warn(game.i18n.localize(this.#validateWarning));
        return false;
      }
    }

    // Generate an key if one isn't specified.
    const key = replacementTarget || foundry.utils.randomID();

    this.#container.update({
      [`system.${this.#propertyName}.${key}`]: linkedDocument
    });

    return true;
  }
}
