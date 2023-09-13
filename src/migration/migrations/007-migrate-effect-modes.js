import MigrationBase from '../MigrationBase';

const EFFECT_MODES_MAP = {
  0: 0, // CUSTOM -> CUSTOM
  1: 1, // MULTIPLY -> MULTIPLY
  2: 2, // ADD -> ADD
  3: 4, // SUBTRACT -> DOWNGRADE
  4: 5, // DOWNGRADE -> UPGRADE
  5: 6 // UPGRADE -> OVERRIDE
};

export default class Migration007MigrateEffectModes extends MigrationBase {
  /** @override */
  static version = 0.007;

  /**
   * @override
   * @param {Object} actorData
   * @returns {Promise<void>}
   */
  async updateActor(actorData) {
    const effects = actorData.effects ?? [];
    if (!effects.length) return;

    actorData.effects = effects.map((effect) => {
      effect.changes = effect.changes.map((change) => {
        change.mode = EFFECT_MODES_MAP[change.mode] ?? 6;
        return change;
      });

      return effect;
    });
  }

  /**
   * @override
   * @param {Object} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
    const effects = itemData.effects ?? [];
    if (!effects.length) return;

    itemData.effects = effects.map((effect) => {
      effect.changes = effect.changes.map((change) => {
        change.mode = EFFECT_MODES_MAP[change.mode] ?? 6;
        return change;
      });

      return effect;
    });
  }
}
