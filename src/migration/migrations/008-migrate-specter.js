import MigrationBase from '../MigrationBase';

export default class Migration008Specter extends MigrationBase {
  /** @override */
  static version = 0.008;

  /**
   * @override
   * @param {ItemData} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
    // Duplicate Effect for each action it has a defined prompt in
    // Add actionId to on Use effect flags
    const actions = itemData?.system?.actions ?? {};
    const effectIds = new Map();

    Object.entries(actions).forEach(([actionId, action]) => {
      const prompts = Object.entries(action?.prompts ?? {})
        .filter(([, prompt]) => prompt.type === 'effect');

      prompts.forEach(([, prompt]) => {
        if (!prompt?.effectId) return;

        if (!(effectIds.has(prompt.effectId))) {
          effectIds.set(prompt.effectId, actionId);
          return;
        }

        const effect = foundry.utils.deepClone(
          itemData.effects.find(({ _id }) => _id === prompt.effectId)
        );
        if (!effect) return;

        effect._id = null;
        // eslint-disable-next-line new-cap
        const newEffect = (new ActiveEffect.implementation(effect)).toObject();
        foundry.utils.setProperty(newEffect, 'flags.a5e.actionId', actionId);

        itemData.effects.push(newEffect);
      });
    });

    // Update effects with actionId
    itemData.effects.forEach((effect) => {
      const actionId = effectIds.get(effect._id);
      if (!actionId) return;

      foundry.utils.setProperty(effect, 'flags.a5e.actionId', actionId);
    });
  }
}
