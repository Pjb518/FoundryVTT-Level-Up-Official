// @ts-nocheck

type LinkedDocumentManagerOptions = {
  validate?: (value: any) => boolean;
  duplicateWarning?: string;
  validateWarning?: string;
};

export default class LinkedDocumentManager {
  #attribute: string;

  #children: Map<String, any>;

  #doc: any;

  #validate: (value: any) => boolean;

  #duplicateWarning = 'A5E.validations.warnings.duplicateLinkedDocument';

  #validateWarning = 'A5E.validations.warnings.invalidLinkedDocument';

  constructor(doc: any, attribute: string, options: LinkedDocumentManagerOptions) {
    if (!(doc instanceof Item)) {
      throw Error('LinkedDocumentManager: Document must be an instance of Item!');
    }

    if (typeof attribute !== 'string') {
      throw Error('LinkedDocumentManager: Attribute is required!');
    }

    if (typeof doc.system[attribute] !== 'object') {
      throw Error(`LinkedDocumentManager: Document must have 'system.${attribute}'`);
    }

    this.#doc = doc;
    this.#attribute = attribute;

    if (options) {
      const { validate, duplicateWarning, validateWarning } = options;

      if (typeof validate === 'function') this.#validate = validate;
      if (typeof duplicateWarning === 'string') this.#duplicateWarning = duplicateWarning;
      if (typeof validateWarning === 'string') this.#validateWarning = validateWarning;
    }

    this.populateChildren();
  }

  async populateChildren() {
    const children = new Map();

    // eslint-disable-next-line no-restricted-syntax
    for await (const value of Object.values(this.#doc.system[this.#attribute])) {
      const child = await fromUuid(value.uuid);
      if (child) children.set(value.uuid, child);
    }

    this.#children = children;
  }

  /** ************************************************
   * Iterator Returns
   * ************************************************ */
  async getDocuments(): Map<String, any> | undefined {
    if (this.#children?.size) return this.#children;

    await this.populateChildren();
    return this.#children;
  }

  getUuid(uuid: string): any {
    return this.#children.get(uuid);
  }

  getIdByUuid(uuid: string): String | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const entry = [...(this.#children ?? [])].find(([_, value]) => value.uuid === uuid);
    return entry ? entry[0] : undefined;
  }

  /** ************************************************
   * Document Management
   * ************************************************ */
  async add(uuid: string, updateData = {}) {
    const duplicate = this.getIdByUuid(uuid);
    if (duplicate) {
      ui.notifications.warn(this.#duplicateWarning);
      return;
    }

    const obj = await fromUuid(uuid);
    if (this.#validate) {
      if (!this.#validate(obj)) {
        ui.notifications.warn(this.#validateWarning);
        return;
      }
    }

    foundry.utils.mergeObject(updateData, { uuid });
    if (obj?.type === 'object') updateData.quantity = obj?.system?.quantity ?? 1;

    const key = duplicate || foundry.utils.randomID();
    await this.#doc.update({ [`system.${this.#attribute}.${key}`]: updateData });
    // TODO: Update child??
  }

  async delete(uuid: String) {
    const key = this.getIdByUuid(uuid);
    if (!key) return;

    await this.#doc.update({ [`system.${this.#attribute}.${key}`]: null });
  }
}
