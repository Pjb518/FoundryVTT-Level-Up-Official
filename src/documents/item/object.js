import ItemA5e from './item';

import SubObjectManager from '../../managers/subItems/SubObjectManager';

import SubObjectField from '../../dataModels/fields/SubObjectField';

export default class ObjectItemA5e extends ItemA5e {
  get weight() {
    // TODO: Implement weight for containers
    return this.system.weight;
  }

  prepareBaseData() {
    if (this.system.objectType === 'container') {
      // Add Data model for container items
      this.system.items = Object.entries(this.system.items ?? {}).reduce((acc, [key, data]) => {
        acc[key] = new SubObjectField(data);
        return acc;
      }, {});
    }
  }

  prepareDerivedData() {
    if (this.system.objectType === 'container') this.prepareContainer();
  }

  prepareContainer() {
    foundry.utils.setProperty(this, 'containerItems', new SubObjectManager(
      this,
      'items',
      { validate: (obj) => obj.type === 'object' }
    ));
  }

  /**
   * @override
   * @returns
   */
  async duplicateItem() {
    if (this.system.objectType !== 'container') return super.duplicateItem();

    if (!this.actor) return null;
    const container = await SubObjectManager.createContainerOnActor(this.parent, this);
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

  async updateContainer(containerUuid) {
    if (containerUuid === this.uuid) return;

    if (!containerUuid) {
      const container = await fromUuid(this.system.containerId);
      if (!container) return;

      await this.update({ 'system.containerId': '' });
      await container.containerItems.delete(this.uuid);
      return;
    }

    // Remove from old container
    const oldContainer = await fromUuid(this.system.containerId);
    if (oldContainer) await oldContainer.containerItems.delete(this.uuid);

    const container = await fromUuid(containerUuid);
    if (!container
      || container?.system?.objectType !== 'container'
      || container?.parent?.id !== this.parent?.id) return;

    await this.update({ 'system.containerId': containerUuid });
    await container.containerItems.add(this.uuid);
  }

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    // TODO: Move from Base to Item & Origin
  }

  async _preUpdate(data, options, user) {
    if (foundry.utils.getProperty(data, 'system.objectType')) await this._preUpdateObjectType();

    super._onUpdate(data, options, user);
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

  async _onCreate(data, options, user) {
    super._onCreate(data, options, user);

    // TODO: Add support for moved containers
  }

  async _onDelete(data, options, user) {
    // Clean up container
    if (!this.parent) return;
    if (this.system.objectType === 'container') {
      // eslint-disable-next-line no-undef
      const items = Object.values(this.system.items).map(({ uuid }) => fromUuidSync(uuid));
      const updates = items.map((i) => ({ _id: i.id, 'system.containerId': '' }));
      await this.parent?.updateEmbeddedDocuments('Item', updates);
    }

    const container = await fromUuid(this.system.containerId);
    if (container) await container?.containerItems?.delete(this.uuid);

    super._onDelete(data, options, user);
  }
}
