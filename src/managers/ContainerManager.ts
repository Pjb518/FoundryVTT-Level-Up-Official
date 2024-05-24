/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import SubObjectField from '../dataModels/fields/SubObjectField';

export default class ContainerManager extends Map<string, SubObjectField> {
  #item: typeof Item;

  constructor(item: typeof Item) {
    if (!item) {
      console.error('Item is required to create a ContainerManager');
      return;
    }

    if (item.system?.objectType !== 'container') {
      console.error('Item must be a container to create a ContainerManager');
      return;
    }

    super();
    this.#item = item;

    const containerData: [string, SubObjectField][] = Object.entries(this.#item.system.items ?? {});

    containerData.forEach(([id, data]) => {
      data._id = id;

      // @ts-ignore
      const doc = new SubObjectField(data, { parent: item });
      if (!doc) return;

      this.set(id, doc);
    });
  }

  /** @deprecated */
  get documents() {
    return [...this.entries()];
  }

  /** ************************************************
  *               Helper methods
  * ************************************************ */
  async add(uuid: string, data: SubObjectField) {
    if (!data) data = {} as SubObjectField;

    const obj = fromUuidSync(uuid);
    if (!obj) {
      ui.notifications.error(`Could not find object with uuid: ${uuid}`);
      return;
    }

    foundry.utils.mergeObject(data, { uuid });
    data.quantity = obj.system?.quantity ?? 1;

    const key = foundry.utils.randomID();
    await this.#item.update({ [`system.items.${key}`]: data });
  }

  async addMulti(uuids: string[]) {
    const updates = {};

    uuids.forEach(async (uuid) => {
      const obj = fromUuidSync(uuid);
      if (!obj) {
        ui.notifications.error(`Could not find object with uuid: ${uuid}`);
        return;
      }

      const key = foundry.utils.randomID();
      updates[`system.items.${key}`] = { uuid, quantity: obj.system?.quantity ?? 1 };
    });

    await this.#item.update(updates);
  }

  async clean() {
    const updates = {};

    [...this.values()].forEach((i) => {
      const child = fromUuidSync(i.uuid);
      if (!child) updates[`system.items.-=${i._id}`] = null;
    });

    await this.#item.update(updates);
  }

  cleanSync() {
    const updates = {};

    [...this.values()].forEach((i) => {
      const child = fromUuidSync(i.uuid);
      if (!child) updates[`system.items.-=${i._id}`] = null;
    });

    this.#item.update(updates);
  }

  async remove(uuid: string) {
    const key = [...this.values()].find((i) => i.uuid === uuid)?._id;
    if (!key) return;

    await this.#item.update({ [`system.items.-=${key}`]: null });
  }

  async removeMulti(uuids: string[]) {
    const keys = [...this.values()].reduce((acc: string[], i) => {
      if (uuids.includes(i.uuid)) acc.push(i._id);
      return acc;
    }, []);

    if (!keys.length) return;

    const updates = {};
    keys.forEach((key) => {
      updates[`system.items.-=${key}`] = null;
    });

    await this.#item.update(updates);
  }

  async removeAll() {
    const keys = [...this.keys()];
    if (!keys.length) return;

    const updates = {};
    keys.forEach((key) => {
      updates[`system.items.-=${key}`] = null;
    });

    await this.#item.update(updates);
  }

  /** ************************************************
  *               Static methods
  * ************************************************ */
  static async createContainerOnActor(actor: any, item: any): Promise<any> {
    await item.containerItems?.clean();

    const containerData: Array<any> = foundry.utils.duplicate(Object.values(item.system.items));

    // Empty container
    await item.containerItems.removeAll();

    const items: (typeof Item)[] = [];
    await Promise.all(containerData.map(async ({ quantityOverride, uuid }) => {
      let doc = await fromUuid(uuid);
      if (!doc) return;

      doc = doc.toObject();
      doc.system.containerId = item.uuid;
      if (quantityOverride) {
        doc.system.quantity = quantityOverride ?? doc.system.quantityOverride;
      }

      if (uuid.startsWith('Compendium')) doc._stats.compendiumSource = uuid;
      items.push(doc);
    }));

    const ids = (await actor.createEmbeddedDocuments('Item', items)).map((i: any) => i.uuid);
    await item.containerItems.addMulti(ids);
    return item;
  }

  static async createContainerOnSidebar(item: any, folderId: string | null): Promise<any> {
    folderId = folderId || item.folder._id || null;

    await item.containerItems?.clean();
    const containerData: Array<any> = foundry.utils.duplicate(Object.values(item.system.items));

    // Empty container
    await item.containerItems.removeAll();

    const items: (typeof Item)[] = [];
    await Promise.all(containerData.map(async ({ quantityOverride, uuid }) => {
      let doc = await fromUuid(uuid);
      if (!doc) return;

      doc = doc.toObject();
      doc.system.containerId = item.uuid;
      if (quantityOverride) {
        doc.system.quantity = quantityOverride ?? doc.system.quantityOverride;
      }

      if (uuid.startsWith('Compendium')) doc._stats.compendiumSource = uuid;
      if (folderId) doc.folder = folderId;

      items.push(doc);
    }));

    const ids = (await Item.createDocuments(items)).map((i: any) => i.uuid);
    await item.containerItems.addMulti(ids);
    if (folderId) await item.update({ folder: folderId });
    return item;
  }
}
