type SubitemManagerOptions = {
  duplicateWarning?: string;
  validateWarning?: string;
  validate?: (value: any) => boolean;
};

export default class SubItemManager extends Map {
  #doc: any;

  #attribute: string;

  #validate: (value: any) => boolean;

  #duplicateWarning = 'A5E.validations.warnings.duplicateSubDocument';

  #validateWarning = 'A5E.validations.warnings.invalidSubDocument';

  constructor(doc: any, attribute: string, options: SubitemManagerOptions) {
    super();

    // @ts-ignore
    if (!(doc instanceof Item)) {
      throw Error('SubDocumentManager: Document must be an instance of Item!');
    }
    if (typeof attribute !== 'string') {
      throw Error('SubDocumentManager: Attribute is required!');
    }
    if (typeof doc.system[attribute] !== 'object') {
      throw Error(`SubDocumentManager: Document must have 'system.${attribute}'`);
    }

    this.#doc = doc;
    this.#attribute = attribute;

    if (options) {
      const { validate, duplicateWarning, validateWarning } = options;

      if (typeof validate === 'function') this.#validate = validate;
      if (typeof duplicateWarning === 'string') this.#duplicateWarning = duplicateWarning;
      if (typeof validateWarning === 'string') this.#validateWarning = validateWarning;
    }

    // Populate the Map
    Object.entries(doc.system[attribute]).forEach(([key, value]) => {
      super.set(key, value);
    });
  }

  /** ************************************************
   * Iterator Returns
   * ************************************************ */
  get documents() {
    return [...this.entries()];
  }

  /**
   * @deprecated Use `get` instead
   */
  getUuid(uuid: string): any {
    const entry = this.get(uuid);
    return entry ? entry[1] : undefined;
  }

  getIdByUuid(uuid: string): string | undefined {
    const entry = this.documents.find(([, value]) => value.uuid === uuid);
    return entry ? entry[0] : undefined;
  }

  /** ************************************************
  *               Internal methods
  * ************************************************ */
  async clean() {
    const updates = {};
    for await (const [key, value] of Object.entries(this.#doc.system[this.#attribute])) {
      // @ts-ignore
      const child = await fromUuid(value.uuid);
      if (!child) updates[`system.${this.#attribute}.-=${key}`] = null;
    }

    await this.#doc.update(updates);
  }

  cleanSync() {
    const updates = {};
    for (const [key, value] of Object.entries(this.#doc.system[this.#attribute])) {
      // @ts-ignore
      const child = fromUuidSync(value.uuid);
      if (!child) updates[`system.${this.#attribute}.-=${key}`] = null;
    }

    this.#doc.update(updates);
  }

  /** ************************************************
  *               External methods
  * ************************************************ */
  async add(uuid: string, updateData = {}): Promise<boolean> {
    const duplicate = this.getIdByUuid(uuid);
    if (duplicate) {
      // @ts-ignore
      ui.notifications.warn(this.#duplicateWarning);
      return false;
    }

    // @ts-ignore
    const obj = await fromUuid(uuid);
    if (this.#validate) {
      if (!this.#validate(obj)) {
        // @ts-ignore
        ui.notifications.warn(this.#validateWarning);
        return false;
      }
    }

    // @ts-ignore
    foundry.utils.mergeObject(updateData, { uuid });
    // @ts-ignore
    if (obj?.type === 'object') updateData.quantity = obj?.system?.quantity ?? 1;

    // @ts-ignore
    const key = duplicate || foundry.utils.randomID();
    await this.#doc.update({ [`system.${this.#attribute}.${key}`]: updateData });
    return true;
  }

  // @ts-ignore
  override async delete(uuid: string): Promise<boolean> {
    const key = this.getIdByUuid(uuid);
    if (!key) return false;

    await this.#doc.update({ [`system.${this.#attribute}.-=${key}`]: null });

    super.delete(key);
    return true;
  }

  async deleteDocuments(uuids: string[]): Promise<boolean> {
    const keys = uuids.map((uuid) => this.getIdByUuid(uuid)).filter((key) => key);
    if (keys.length === 0) return false;

    const updates = {};
    keys.forEach((key) => {
      updates[`system.${this.#attribute}.-=${key}`] = null;
    });

    await this.#doc.update(updates);
    return true;
  }
}
