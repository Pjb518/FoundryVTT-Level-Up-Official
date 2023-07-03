import MigrationBase from '../MigrationBase';

/**
 * @override
 * @param {Object} itemData
 * @returns {Promise<void>}
 */
export default class Migration005MigrateAC extends MigrationBase {
  /** @override */
  static version = 0.005;

  async updateActor(actorData) {
    const { ac } = actorData.system.attributes;
    if (!ac) return;

    foundry.utils.setProperty(actorData, 'system.attributes.ac', {
      base: ac
    });
  }
}
