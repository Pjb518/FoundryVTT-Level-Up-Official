import MigrationBase from '../MigrationBase';

/**
 * @override
 * @param {Object} itemData
 * @returns {Promise<void>}
 */
export default class Migration004EquippedState extends MigrationBase {
  /** @override */
  static version = 0.004;

  async updateItem(itemData) {
    if (itemData.type !== 'object') return;

    const equippedState = itemData.system.equipped
      ? CONFIG.A5E.EQUIPPED_STATES.EQUIPPED
      : CONFIG.A5E.EQUIPPED_STATES.NOT_CARRIED;

    foundry.utils.setProperty(itemData, 'system.equippedState', equippedState);

    // Delete old property
    itemData['system.-=equipped'] = null;
  }
}
