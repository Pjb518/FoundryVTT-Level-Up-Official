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

    foundry.utils.setProperty(actorData, 'system.attributes.ac.baseFormula', `${base}`);
    actorData['system.attributes.ac.-=base'] = null;
  }

  /**
   * @override
   * @param {Object} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
  }
}
