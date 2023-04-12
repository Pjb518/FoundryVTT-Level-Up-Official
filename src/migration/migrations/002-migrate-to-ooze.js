import MigrationBase from '../MigrationBase';

const FEATURE_ITEMS = ['background', 'class', 'culture', 'destiny', 'heritage', 'subclass'];

function createAmmoConsumer(i) {
  const [actionId, action] = Object.entries(i.system.actions ?? {})?.[0] ?? [[], []];
  if (!actionId) return;

  const attackRolls = Object.values(action.rolls ?? {}).filter((r) => r.type === 'attack');
  if (!attackRolls.length) return;

  const attackRoll = attackRolls[0];
  if (attackRoll.attackType !== 'rangedWeaponAttack') return;

  const consumer = {
    itemId: '',
    quantity: 1,
    type: 'ammunition'
  };

  foundry.utils.setProperty(i, `system.actions.${actionId}.consumers`, {
    [foundry.utils.randomID()]: consumer
  });
}

function createUsesConsumer(i) {
  const usesCurrent = parseInt(i.system.uses.value, 10);
  const usesMax = parseInt(i.system.uses.max, 10);
  if (!usesMax && !usesCurrent) return;

  const actionId = Object.keys(i.system.actions ?? {})?.[0];
  if (!actionId) return;

  const consumer = {
    type: 'itemUses'
  };

  foundry.utils.setProperty(i, `system.actions.${actionId}.consumers`, {
    [foundry.utils.randomID()]: consumer
  });
}

function createManeuverConsumer(i) {
  const exertion = parseInt(i.system.exertionCost, 10);
  if (!exertion || exertion === 0) return;

  const actionId = Object.keys(i.system.actions ?? {})?.[0];
  if (!actionId) return;

  const consumer = {
    quantity: exertion ?? 1,
    resource: 'exertion',
    type: 'resource'
  };

  foundry.utils.setProperty(i, `system.actions.${actionId}.consumers`, {
    [foundry.utils.randomID()]: consumer
  });
}

function createSpellConsumer(i) {
  const level = parseInt(i.system.level, 10);
  if (level === 0) return;

  const actionId = Object.keys(i.system.actions ?? {})?.[0];
  if (!actionId) return;

  const consumer = {
    mode: 'variable',
    spellLevel: level ?? 1,
    points: CONFIG.A5E.spellLevelCost[parseInt(level, 10)] ?? 2,
    type: 'spell'
  };

  foundry.utils.setProperty(i, `system.actions.${actionId}.consumers`, {
    [foundry.utils.randomID()]: consumer
  });
}

export default class Migration002Ooze extends MigrationBase {
  /** @override */
  static version = 0.002;

  #createConsumers(itemData) {
    if (FEATURE_ITEMS.includes(itemData.type)) return;
    // Ammunition Consumers
    if (itemData.type === 'object' && itemData.system.objectType === 'weapon') {
      createAmmoConsumer(itemData);
    }

    // Manuevers Consumers
    if (itemData.type === 'maneuver') createManeuverConsumer(itemData);

    // Spell Consumers
    if (itemData.type === 'spell') createSpellConsumer(itemData);

    // Uses Consumers
    createUsesConsumer(itemData);
  }

  #updateMaxUsesField(itemData) {
    const { uses } = itemData.system;
    if (!uses?.max || uses?.max === '') return;

    foundry.utils.setProperty(itemData, 'system.uses.max', uses.max?.toString());
  }

  /**
   * @override
   * @param {Object} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
    // Only run this if the system version is below 0.9.0
    const lastMigrationVersion = game.settings.get('a5e', 'systemMigrationVersion');
    const isNewer = foundry.utils.isNewerVersion(lastMigrationVersion, '0.9.10');
    if (isNewer) return;

    this.#createConsumers(itemData);
    this.#updateMaxUsesField(itemData);
  }
}
