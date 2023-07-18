import MigrationBase from '../MigrationBase';

export default class Migration006MigrateFormulaACAndBroken extends MigrationBase {
  /** @override */
  static version = 0.006;

  /**
   * @override
   * @param {Object} actorData
   * @returns {Promise<void>}
   */
  async updateActor(actorData) {
    const { base } = actorData.system.attributes.ac ?? { base: 10 };

    if (typeof actorData.system.attributes.ac !== 'object') {
      foundry.utils.setProperty(actorData, 'system.attributes.ac', {
        baseFormula: `${actorData.system.attributes.ac}`,
        value: 0
      });
    } else {
      foundry.utils.setProperty(actorData, 'system.attributes.ac.baseFormula', `${base}`);
      actorData['system.attributes.ac.-=base'] = null;
    }
  }

  /**
   * @override
   * @param {Object} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
    if (itemData.type !== 'object') return;

    const damagedState = itemData.system.broken
      ? CONFIG.A5E.DAMAGED_STATES.BROKEN
      : CONFIG.A5E.DAMAGED_STATES.INTACT;

    foundry.utils.setProperty(itemData, 'system.damagedState', damagedState);
    itemData['system.-=broken'] = null;
  }
}
