import { grantsClassMappings } from '../config/registerGrantsConfig';

export default class ItemGrantsManager extends Map {
  #item;

  constructor(item) {
    super();

    this.#item = item;
    Object.entries(this.#item.system.grants ?? {}).forEach(([id, data]) => {
      data._id = id;
      const grant = new grantsClassMappings[data.type](data, { parent: item });

      this.set(id, grant);
    });
  }

  /**
   * @param {String} type
   * @returns
   */
  byType(type) {
    return [...this.values()].filter((grant) => grant.type === type);
  }

  /** ************************************************
  *               External methods
  * ************************************************ */
  async add(data = {}) {
    await ItemGrantsManager.addGrant(this.#item, data);
  }

  async clear() {
    await this.#item.update({
      'system.-=grants': null
    });

    await this.#item.update({ 'system.grants': {} });
  }

  async duplicate(id) {
    const newGrant = foundry.utils.duplicate(this.#item.system.grants[id]);
    newGrant.name = `${newGrant.name} (Copy)`;

    await this.#item.update({
      'system.grants': {
        ...this.#item.system.grants,
        [foundry.utils.randomID()]: newGrant
      }
    });
  }

  async delete(id) {
    super.delete(id);

    await this.#item.update({
      'system.grants': {
        [`-=${id}`]: null
      }
    });
  }

  /** ************************************************
  *                Static methods
  * ************************************************ */
  static async addGrant(item, data = {}, update = true) {
    const newGrant = foundry.utils.mergeObject({
      type: 'skill',
      level: 0
    }, data);

    const updateData = {
      'system.grants': {
        ...item.system.grants,
        [data?._id ?? foundry.utils.randomID()]: newGrant
      }
    };

    if (update) await item.update(updateData);
    return updateData;
  }
}
