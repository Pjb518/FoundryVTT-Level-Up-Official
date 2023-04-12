/* eslint-disable no-unused-vars */
import MigrationBase from '../MigrationBase';

const FEATURE_ITEMS = ['background', 'class', 'culture', 'destiny', 'heritage', 'subclass'];

export default class Migration003Uses extends MigrationBase {
  /** @override */
  static version = 0.003;

  #updateActionUses(itemData) {
    const actions = Object.entries(itemData.system.actions ?? {});
    actions.forEach(([actionId, action]) => {
      const actionConsumers = Object.entries(action.consumers ?? {}).filter(([_, c]) => c.type === 'actionUses');
      const rechargeConsumers = Object.entries(action.consumers ?? {}).filter(([_, c]) => c.type === 'recharge');
      const consumerIds = [];

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
        });
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
          consumerIds.push(id);
          delete itemData.system.actions[actionId].consumers[id];
        });
      }

      // Create new uses consumers
      const newObject = {
        ...itemData.system.actions[actionId].consumers
      };

      consumerIds.forEach((id) => {
        newObject[`-=${id}`] = null;
      });

      itemData[`system.actions.${actionId}.consumers`] = newObject;
    });
  }

  #updateRechargeData(itemData) {
    const recharge = {
      formula: itemData.system.recharge?.formula ?? '1d6',
      threshold: itemData.system.recharge?.threshold ?? 6
    };

    itemData['system.uses.recharge'] = recharge;
    itemData['system.-=recharge'] = null;
  }

  /**
   * @override
   * @param {Object} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
    if (FEATURE_ITEMS.includes(itemData.type)) return;

    this.#updateActionUses(itemData);
    this.#updateRechargeData(itemData);
  }
}
