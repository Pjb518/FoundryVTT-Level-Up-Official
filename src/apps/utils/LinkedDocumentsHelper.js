export default class LinkedDocumentsHelper {
  _container;

  _pathKey;

  _validate = null;

  _duplicateWarning = 'A5E.DuplicateLinkedDocumentsWarning';

  _validateWarning = 'A5E.InvalidLinkedDocumentsWarning';

  constructor(container, key, options) {
    if (!(container instanceof Item)) throw Error('LinkedDocumentsHelper: container must be an instance of Item!');
    if (typeof key !== 'string') throw Error('LinkedDocumentsHelper: key is required!');
    if (typeof container.system[key] !== 'object') throw Error(`LinkedDocumentsHelper: container must have a document key of 'system.${key}'`);

    this._container = container;
    this._pathKey = key;

    if (typeof options?.validate === 'function') {
      this._validate = options.validate;
    }

    if (typeof options?.validateWarning === 'string') {
      this._validateWarning = options.validateWarning;
    }

    if (typeof options?.duplicateWarning === 'string') {
      this._duplicateWarning = options.duplicateWarning;
    }
  }

  async add(linkRef) {
    return this._add(linkRef);
  }

  async replace(previousUuid, linkRef) {
    return this._add(linkRef, this._findKey(previousUuid));
  }

  async remove(uuid) {
    const key = this._findKey(uuid);
    if (key) {
      await this._container.update({ [`system.${this._pathKey}.-=${key}`]: null });
      return true;
    }
    return false;
  }

  find(uuid) {
    const key = this._findKey(uuid);
    if (key) {
      return this.linkRefs[key];
    }
    return null;
  }

  get linkRefs() {
    return this._container.system[this._pathKey];
  }

  _findKey(uuid) {
    const entry = Object.entries(this.linkRefs).find((e) => e[1]?.uuid === uuid);
    return entry ? entry[0] : null;
  }

  async _add(linkRef, replaceKey) {
    // Check we don't already have this feature added.
    const duplicateIndex = this._findKey(linkRef.uuid);
    if (duplicateIndex) {
      ui.notifications.warn(game.i18n.localize(this._duplicateWarning));
      return false;
    }

    if (this._validate) {
      const obj = await fromUuid(linkRef.uuid);
      if (!this._validate(obj)) {
        ui.notifications.warn(game.i18n.localize(this._validateWarning));
        return false;
      }
    }

    // Generate an index if one isn't specified.
    let key = replaceKey;
    if (!key) {
      key = foundry.utils.randomID();
    }

    this._container.update({
      [`system.${this._pathKey}.${key}`]: linkRef
    });

    return true;
  }
}
