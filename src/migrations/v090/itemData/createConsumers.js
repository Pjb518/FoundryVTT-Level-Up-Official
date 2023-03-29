const FEATURE_ITEMS = ['background', 'class', 'culture', 'destiny', 'heritage', 'subclass'];

export default function createConsumers(itemData, updateData) {
  if (FEATURE_ITEMS.includes(itemData.type)) return;
  // Ammunition Consumers
  if (itemData.type === 'object' && itemData.system.objectType === 'weapon') {
    createAmmoConsumer(itemData, updateData);
  }

  // Manuevers Consumers
  if (itemData.type === 'maneuver') createManeuverConsumer(itemData, updateData);

  // Spell Consumers
  if (itemData.type === 'spell') createSpellConsumer(itemData, updateData);

  // Uses Consumers
  createUsesConsumer(itemData, updateData);
}

function createAmmoConsumer(i, updateData) {
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

  updateData[`system.actions.${actionId}.consumers`] = {
    [foundry.utils.randomID()]: consumer
  };
}

function createUsesConsumer(i, updateData) {
  const usesCurrent = parseInt(i.system.uses.value, 10);
  const usesMax = parseInt(i.system.uses.max, 10);
  if (!usesMax && !usesCurrent) return;

  const actionId = Object.keys(i.system.actions ?? {})?.[0];
  if (!actionId) return;

  const consumer = {
    type: 'itemUses'
  };

  updateData[`system.actions.${actionId}.consumers`] = {
    [foundry.utils.randomID()]: consumer
  };
}

function createManeuverConsumer(i, updateData) {
  const exertion = parseInt(i.system.exertionCost, 10);
  if (!exertion || exertion === 0) return;

  const actionId = Object.keys(i.system.actions ?? {})?.[0];
  if (!actionId) return;

  const consumer = {
    quantity: exertion ?? 1,
    resource: 'exertion',
    type: 'resource'
  };

  updateData[`system.actions.${actionId}.consumers`] = {
    [foundry.utils.randomID()]: consumer
  };
}

function createSpellConsumer(i, updateData) {
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

  updateData[`system.actions.${actionId}.consumers`] = {
    [foundry.utils.randomID()]: consumer
  };
}
