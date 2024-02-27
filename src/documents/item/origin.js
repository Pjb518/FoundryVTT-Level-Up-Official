import BaseItemA5e from './base';

import ItemGrantsManager from '../../managers/ItemGrantsManager';

export default class OriginItemA5e extends BaseItemA5e {
  prepareBaseData() {
    super.prepareBaseData();

    // Setup Grants System
    this.grants = new ItemGrantsManager(this);
  }

  async _onCreate(data, options, userId) {
    if (userId !== game.userId) {
      super._onCreate(data, options, userId);
      return;
    }

    // Apply grants if any
    if (this.parent && this.parent.documentName === 'Actor') {
      const actor = this.parent;
      actor.grants.applyGrant(this.id);
    }

    super._onCreate(data, options, userId);
  }

  async _onDelete(data, options, user) {
    super._onDelete(data, options, user);

    if (!this.parent || this.parent?.documentName !== 'Actor') return;

    const actor = this.parent;
    await actor.grants.removeGrantsByItem(this.uuid);
  }
}
