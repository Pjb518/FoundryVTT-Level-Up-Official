import BaseItemA5e from './base';

import ItemGrantsManager from '../../managers/ItemGrantsManager';

export default class OriginItemA5e extends BaseItemA5e {
  prepareBaseData() {
    super.prepareBaseData();

    // Setup Grants System
    this.grants = new ItemGrantsManager(this);
  }

  _preCreate(data, options, user) {
    if (user._id !== game.userId) {
      super._preCreate(data, options, user);
      return;
    }

    // Apply grants if any
    if (this.parent && this.parent.documentName === 'Actor') {
      const actor = this.parent;
      // Keep id of the original document
      options.keepId = true;
      if (!options.noGrant) actor.grants.createInitialGrants(this, false);
    }

    super._preCreate(data, options, user);
  }

  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }

  async _onDelete(data, options, userId) {
    super._onDelete(data, options, userId);

    if (!this.parent || this.parent?.documentName !== 'Actor') return;

    const actor = this.parent;
    await actor.grants.removeGrantsByItem(this.uuid);
  }
}
