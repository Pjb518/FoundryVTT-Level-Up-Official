import type { A5EObjectData } from '../../dataModels/item/ObjectDataModel';

import ItemA5e from './item';

import ContainerManager from '../../managers/ContainerManager';

export default class ObjectItemA5e extends ItemA5e {
  declare containerItems: ContainerManager | null;

  declare system: InstanceType<typeof A5EObjectData>;

  get weight() {
    if (this.system.objectType === 'container') {
      const w = this.containerItems?.weight ?? 0;
      if (w instanceof Promise) return w.then((cw) => (cw ?? 0) + this.system.weight);

      return w + this.system.weight;
    }

    return this.system.weight;
  }

  get container() {
    if (!this.system.containerId) return null;
    if (this.isEmbedded) return this.actor.items.get(this.system.containerId);
    if (this.pack) return game.packs.get(this.pack)?.getDocument(this.system.containerId);
    return game.items.get(this.system.containerId);
  }

  // TODO: Container Rework - Add a solid fix at some point
  get containerItemNames() {
    if (!this.containerItems) return '';

    const names = (this.containerItems.allItems as any[] ?? []).map((i) => i.name);

    return names.join(', ');
  }

  get contents() {
    if (this.system.objectType !== 'container') return [];
    return this.containerItems?.items ?? [];
  }

  prepareBaseData() {
    super.prepareBaseData();

    if (this.system.objectType === 'container') {
      this.containerItems = new ContainerManager(this);
    }
  }

  prepareDerivedData() {
    super.prepareDerivedData();
  }

  /**
   * @override
   * @returns
   */
  async duplicateItem() {
    if (this.system.objectType !== 'container') return super.duplicateItem();

    if (!this.actor) return null;
    const container = await ContainerManager.createContainerOnActor(this.parent, this);
    return container;
  }

  async toggleAttunement() {
    await this.update({
      'system.attuned': !this.system.attuned
    });
  }

  async toggleDamagedState() {
    const currentState = this.system.damagedState;
    const newState = (currentState + 1) % 3;

    await this.update({
      'system.damagedState': newState
    });
  }

  async toggleEquippedState() {
    if (!this.actor) return;

    const currentState = this.system.equippedState;
    let newState = (currentState + 1) % 3;

    // Check if armor is already equipped
    if (newState === CONFIG.A5E.EQUIPPED_STATES.EQUIPPED && this.system.objectType === 'armor') {
      const { hasArmor, hasUnderArmor } = this.parent.items.reduce((acc, item) => {
        if (item.system.equippedState !== CONFIG.A5E.EQUIPPED_STATES.EQUIPPED
          || item.system.objectType !== 'armor') return acc;
        const isUnderarmor = item.system.materialProperties.includes('underarmor');
        if (isUnderarmor) acc.hasUnderArmor = true;
        else acc.hasArmor = true;
        return acc;
      }, { hasArmor: false, hasUnderArmor: false });

      const isUnderarmor = this.system.materialProperties.includes('underarmor');
      if (isUnderarmor && hasUnderArmor) newState = 0;
      else if (!isUnderarmor && hasArmor) newState = 0;

      // Warn user
      if (newState === 0) {
        ui.notifications.warn(game.i18n.localize('A5E.armorClass.armorAlreadyEquipped'));
      }
    }

    // Check if 2 shields are already equipped
    if (newState === 2 && this.system.objectType === 'shield') {
      const shields = this.parent.items.filter((i) => (
        i.system.equippedState === CONFIG.A5E.EQUIPPED_STATES.EQUIPPED
        && i.system.objectType === 'shield'));
      if (shields.length >= 2) newState = 0;
      if (newState === 0) {
        ui.notifications.warn(game.i18n.localize('A5E.armorClass.shieldAlreadyEquipped'));
      }
    }

    await this.update({
      'system.equippedState': newState
    });
  }

  async toggleUnidentified() {
    await this.update({
      'system.unidentified': !this.system.unidentified
    });
  }

  // TODO: Container Rework - Move to manager
  async updateContainer(containerUuid) {
    if (containerUuid === this.uuid) return;

    if (!containerUuid) {
      const container = await fromUuid(
        this.system.containerId
      ) as InstanceType<typeof ObjectItemA5e> | null;
      if (!container) return;

      await this.update({ 'system.containerId': '' });
      await container.containerItems?.remove(this.uuid);
      return;
    }

    // Remove from old container
    const oldContainer = await fromUuid(
      this.system.containerId
    ) as InstanceType<typeof ObjectItemA5e> | null;

    if (oldContainer) await oldContainer.containerItems?.remove(this.uuid);

    const container = await fromUuid(containerUuid) as InstanceType<typeof ObjectItemA5e> | null;
    if (!container
      || container?.system?.objectType !== 'container'
      || container?.parent?.id !== this.parent?.id) return;

    await this.update({ 'system.containerId': containerUuid });
    // TODO: Types - Fix this
    await container.containerItems?.add(this.uuid);
  }

  /** @inheritdoc */
  _preCreate(data, options, user) {
    super._preCreate(data, options, user);
  }

  async _preUpdate(data, options, user) {
    if (foundry.utils.getProperty(data, 'system.objectType')) await this._preUpdateObjectType();

    super._preUpdate(data, options, user);
  }

  async _preUpdateObjectType() {
    if (this.system.objectType !== 'container') return;

    const updates = {};
    const children = Object.entries(this.system.items ?? {});

    // eslint-disable-next-line no-restricted-syntax
    for await (const [key, item] of children) {
      updates[`system.items.-=${key}`] = null;

      const child = await fromUuid(item.uuid);
      if (!child) continue;

      await child.update({ 'system.containerId': '' });
    }

    await this.update(updates);
  }

  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    if (userId !== game.userId) return;

    if (this.system.objectType === 'container') {
      if (this.parent?.documentName === 'Actor') {
        await ContainerManager.createContainerOnActor(this.parent, this);
      } else if (this.pack) {
        // Do nothing
      } else {
        await ContainerManager.createContainerOnSidebar(this);
      }
    }

    // Clean containerId on object creation
    const container = await fromUuid(this.system.containerId);
    if (!container) await this.update({ 'system.containerId': '' });

    // Update quantity consumers to set themselves as the target
    const updates = {};
    const actions = Object.entries(this.system.actions ?? {});
    actions.forEach(([actionId, action]) => {
      const consumers = Object.entries(action.consumers ?? {});
      consumers.forEach(([consumerId, consumer]) => {
        if (consumer.type !== 'quantity') return;
        updates[`system.actions.${actionId}.consumers.${consumerId}.itemId`] = this._id;
      });
    });

    await this.update(updates);
  }

  async _onDelete(data, options, user) {
    // Clean up container
    if (!this.parent) return;
    if (this.system.objectType === 'container') {
      // eslint-disable-next-line no-undef
      const items = Object.values(this.system.items).map(({ uuid }) => fromUuidSync(uuid));
      const updates = items.map((i) => ({ _id: i?.id, 'system.containerId': '' }));
      await this.parent?.updateEmbeddedDocuments('Item', updates);
    }

    const container = await fromUuid(
      this.system.containerId
    ) as InstanceType<typeof ObjectItemA5e> | null;

    if (container) await container?.containerItems?.delete(this.uuid);

    super._onDelete(data, options, user);
  }
}
