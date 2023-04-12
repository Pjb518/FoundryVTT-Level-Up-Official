/* eslint-disable no-unused-vars */
import MigrationBase from '../MigrationBase';

const FEATURE_ITEMS = ['background', 'class', 'culture', 'destiny', 'heritage', 'subclass'];

export default class Migration002Ooze extends MigrationBase {
  /** @override */
  static version = 0.002;

  #updateActionUses(itemData) {
    const actions = Object.entries(itemData.system.actions ?? {});
    actions.forEach(([actionId, action]) => {
      const actionConsumers = Object.entries(action.consumers ?? {}).filter(([_, c]) => c.type === 'actionUses');
      const itemConsumers = Object.entries(action.consumers ?? {}).filter(([_, c]) => c.type === 'itemUses');
      const rechargeConsumers = Object.entries(action.consumers ?? {}).filter(([_, c]) => c.type === 'recharge');
      const createConsumer = actionConsumers.length
        && itemConsumers.length
        && rechargeConsumers.length;
      let consumeType;

      if (!createConsumer) return;

      // Move action uses to proper place
      if (actionConsumers.length) {
        actionConsumers.forEach(([id, consumer]) => {
          const uses = {
            value: consumer.value ?? 0,
            max: consumer.max ?? '',
            per: consumer.per,
            recharge: {
              formula: '1d6',
              threshold: 6
            }
          };

          // Set action uses
          itemData.system.actions[actionId].uses = uses;

          // Delete actionUses consumer
          itemData[`system.actions.${actionId}.consumers.-=${id}`] = null;
          consumeType = 'action';
        });
      }

      // Move data for item consumer
      if (itemConsumers.length) {
        const [id] = itemConsumers;

        // Update consume Type
        if (consumeType === 'action') consumeType = 'both';
        else consumeType = 'item';

        // Delete itemUses consumer
        itemData[`system.actions.${actionId}.consumers.-=${id}`] = null;
      }

      // Move data for recharges
      if (rechargeConsumers.length) {
        rechargeConsumers.forEach(([id, consumer]) => {
          const recharge = {
            formula: consumer.formula ?? '1d6',
            threshold: consumer.threshold ?? 6
          };

          itemData[`system.actions.${actionId}.uses.per`] = 'recharge';
          itemData[`system.actions.${actionId}.uses.recharge`] = recharge;

          // Delete consumer
          itemData[`system.actions.${actionId}.consumers.-=${id}`] = null;
        });
      }

      // Create new uses consumers
      itemData[`system.actions.${actionId}.consumers`] = {
        ...itemData.system.actions[actionId].consumers,
        [foundry.utils.randomID()]: {
          quantity: 1,
          consumeType,
          type: 'uses'
        }
      };
    });
  }

  #updateRechargeData(itemData) {
    const recharge = {
      formula: itemData.system.recharge?.formula ?? '1d6',
      threshold: itemData.system.recharge?.threshold ?? 6
    };

    itemData['system.uses.recharge'] = recharge;
  }

  /**
   * @override
   * @param {Object} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
    this.#updateActionUses(itemData);
    this.#updateRechargeData(itemData);
  }
}
