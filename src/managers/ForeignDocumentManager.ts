/* eslint-disable @typescript-eslint/no-unused-vars */
import DataProxy from './DataProxy';

type ForeignDocumentManagerOptions = {
  duplicateWarning?: string;
  validateWarning?: string;
  validate?: (value: any) => boolean;
};

export default class ForeignDocumentManager extends DataProxy {
  #doc: any;

  #attribute: string;

  #validate?: (value: any) => boolean;

  #duplicateWarning = 'A5E.validations.warnings.duplicateForeignDocument';

  #validateWarning = 'A5E.validations.warnings.invalidForeignDocument';

  constructor(doc: any, attribute: string, options: ForeignDocumentManagerOptions) {
    if (!(doc instanceof Item)) {
      throw Error('ForeignDocumentManager: Document must be an instance of Item!');
    }
    if (typeof attribute !== 'string') {
      throw Error('ForeignDocumentManager: Attribute is required!');
    }
    if (typeof doc.system[attribute] !== 'object') {
      throw Error(`ForeignDocumentManager: Document must have 'system.${attribute}'`);
    }

    super(foundry.utils.getProperty(doc, `system.${attribute}`));
    this.#doc = doc;
    this.#attribute = attribute;

    if (options) {
      const { validate, duplicateWarning, validateWarning } = options;

      if (typeof validate === 'function') this.#validate = validate;
      if (typeof duplicateWarning === 'string') this.#duplicateWarning = duplicateWarning;
      if (typeof validateWarning === 'string') this.#validateWarning = validateWarning;
    }
  }

  /** ************************************************
   * Iterator Returns
   * ************************************************ */
  get documents() {
    return this.#doc.system[this.#attribute];
  }

  getUuid(uuid: string): any {
    const entry = Object.entries(this.documents)
      .find(([, value]: [string, any]) => value.uuid === uuid);
    return entry ? entry[1] : undefined;
  }

  getIdByUuid(uuid: string): string | undefined {
    const entry = Object.entries(this.documents)
      .find(([, value]: [string, any]) => value.uuid === uuid);
    return entry ? entry[0] : undefined;
  }

  /** ************************************************
   * Internal Methods
   * ************************************************ */
  async add(uuid: string, updateData: any = {}): Promise<boolean> {
    const duplicate = this.getIdByUuid(uuid);
    if (duplicate) {
      ui.notifications.warn(this.#duplicateWarning);
      return false;
    }

    const obj = await fromUuid(uuid);
    if (this.#validate) {
      if (!this.#validate(obj)) {
        ui.notifications.warn(this.#validateWarning);
        return false;
      }
    }

    foundry.utils.mergeObject(updateData, { uuid });
    if (obj?.type === 'object') updateData.quantity = obj?.system?.quantity ?? 1;

    const key = duplicate || foundry.utils.randomID();
    await this.#doc.update({ [`system.${this.#attribute}.${key}`]: updateData });
    return true;
  }

  async delete(uuid: string): Promise<boolean> {
    const key = this.getIdByUuid(uuid);
    if (!key) return false;

    await this.#doc.update({ [`system.${this.#attribute}.-=${key}`]: null });
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

  async clean() {
    const updates = {};
    for await (const [key, value] of Object.entries(this.#doc.system[this.#attribute])) {
      // @ts-ignore
      const child = await fromUuid(value?.uuid);
      if (!child) updates[`system.${this.#attribute}.-=${key}`] = null;
    }

    await this.#doc.update(updates);
  }
}
