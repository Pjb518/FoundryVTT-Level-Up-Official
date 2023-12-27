import ItemA5e from './item';

import ItemGrantsManager from '../../managers/ItemGrantsManager';

export default class FeatureItemA5e extends ItemA5e {
  prepareBaseData() {
    super.prepareBaseData();

    // Setup Grants system
    this.grants = new ItemGrantsManager(this);
  }

  async _onCreate(data, options, user) {
    // Apply grants if any
    if (this.parent && this.parent.documentName === 'Actor') {
      const actor = this.parent;
      await actor.GrantsManager.applyGrants();
    }

    super._onCreate(data, options, user);
  }

  async _onDelete(data, options, user) {
    super._onDelete(data, options, user);

    if (!this.parent || this.parent?.documentName !== 'Actor') return;

    const actor = this.parent;
    await actor.GrantsManager.removeGrantsByItem(this.uuid);
  }
}
