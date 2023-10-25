import SubItemManager from './SubItemManager';

export default class SubObjectManager extends SubItemManager {
  #duplicateWarning = 'A5E.validations.warnings.duplicateSubObjectDocument';

  #validateWarning = 'A5E.validations.warnings.invalidSubObjectDocument';

  // constructor(doc: any, attribute: string, options: any) {
  //   super(doc, attribute, options);
  //   // TODO: Add custom options here
  // }

  /** ************************************************
  *               Internal methods
  * ************************************************ */

  /** ************************************************
  *               External methods
  * ************************************************ */

  /** ************************************************
  *               Container methods
  * ************************************************ */
  static async createContainerOnActor(actor: any, item: any): Promise<any> {
    await item.containerItems?.clean();

    const emptyContainer = item.toObject();
    emptyContainer.system.items = {};
    emptyContainer.system.containerId = null;

    const container = (await actor.createEmbeddedDocuments('Item', [emptyContainer]))?.[0];
    const containerItems: Array<any> = Object.values(item.system.items);

    // Get all items and subContainers
    const items = [];
    const subContainers = [];

    for await (const { quantityOverride, sourceUuid, uuid } of containerItems) {
      // @ts-ignore
      let i = (await fromUuid(uuid)) ?? (await fromUuid(sourceUuid));
      if (!i) continue;
      if (i.system.objectType === 'container') {
        subContainers.push(i);
        continue;
      }

      i = i.toObject();
      i.system.containerId = container.uuid;
      if (quantityOverride) i.system.quantity = quantityOverride ?? i.system.quantityOverride;
      items.push(i);
    }

    // Create subContainers
    const newSubContainers = await Promise.all(
      subContainers.map((c) => this.createContainerOnActor(actor, c))
    );

    const newItems = await actor.createEmbeddedDocuments('Item', items);
    [...newItems, ...newSubContainers].forEach((i) => i.updateContainer(container.uuid));

    return container;
  }

  static async createContainerOnSideBar(item: any): Promise<any> {
    await item.containerItems?.clean();

    const emptyContainer = item.toObject();
    emptyContainer.system.items = {};
    emptyContainer.system.containerId = null;

    // @ts-ignore
    const container = (await Item.createDocuments([emptyContainer]))?.[0];
    const containerItems: Array<any> = Object.values(item.system.items);

    // Get all items and subContainers
    const items = [];
    const subContainers = [];

    for await (const { quantityOverride, sourceUuid, uuid } of containerItems) {
      // @ts-ignore
      let i = (await fromUuid(uuid)) ?? (await fromUuid(sourceUuid));
      if (!i) continue;
      if (i.system.objectType === 'container') {
        subContainers.push(i);
        continue;
      }

      i = i.toObject();
      i.system.containerId = container.uuid;
      if (quantityOverride) i.system.quantity = quantityOverride ?? i.system.quantityOverride;
      items.push(i);
    }

    // Create subContainers
    const newSubContainers = await Promise.all(
      subContainers.map((c) => this.createContainerOnSideBar(c))
    );

    // @ts-ignore
    const newItems = await Item.createDocuments(items);
    [...newItems, ...newSubContainers].forEach((i) => i.updateContainer(container.uuid));

    return container;
  }
}
