import MigrationBase from '../MigrationBase';

export default class Migration009Genie extends MigrationBase {
  /** @override */
  static version = 0.009;

  /**
   * @override
   * @param {Object} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
    // Update system schema for data model introduction
    if (!itemData.system?.schema?.version) return;

    const schemaData = itemData.system.schema;
    foundry.utils.setProperty(itemData, 'system.schemaVersion', schemaData);
    itemData['system.-=schema'] = null;
  }

  /**
   * @override
   * @param {Object} actorData
   * @returns {Promise<void>}
   */
  async updateActor(actorData) {
    // Update system schema for data model introduction
    if (!actorData.system?.schema?.version) return;

    const schemaData = actorData.system.schema;
    foundry.utils.setProperty(actorData, 'system.schemaVersion', schemaData);
    actorData['system.-=schema'] = null;
  }
}
