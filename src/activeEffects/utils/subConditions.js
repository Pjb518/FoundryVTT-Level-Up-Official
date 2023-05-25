/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import getTokenFromActor from '../../utils/getTokenFromActor';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Create Active Effect
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Add linked conditions to the token.
 * @param {Object} conditionData
 */
export async function addSubConditions(conditionData) {
  const conditions = new Set(Object.keys(CONFIG.A5E.conditions));
  const token = getTokenFromActor(conditionData.parent);

  // Guards
  if (!token) return;
  if (conditions.intersection(conditionData.statuses).size === 0) return;
  if (!conditionData.flags?.a5e?.conditions) return;

  // Set other conditions
  for (const c of conditionData.flags.a5e.conditions) {
    const effect = CONFIG.statusEffects.find((e) => e.id === c);

    // TODO: Allow multiple sources of the same effect
    foundry.utils.setProperty(effect, 'flags.a5e.source', conditionData.statuses.first());
    await token.toggleActiveEffect(effect, { active: true });
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Delete Active Effect
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Remove linked conditions to the token.
 * @param {Object} conditionData
 */
export async function removeSubConditions(conditionData) {
  const conditions = new Set(Object.keys(CONFIG.A5E.conditions));
  const token = getTokenFromActor(conditionData.parent);

  // Guards
  if (!token) return;
  if (conditions.intersection(conditionData.statuses).size === 0) return;
  if (!conditionData.flags?.a5e?.conditions) return;

  // Set other conditions
  for (const c of conditionData.flags.a5e.conditions) {
    const effect = CONFIG.statusEffects.find((e) => e.id === c);
    await token.toggleActiveEffect(effect, { active: false });
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Delete Active Effect
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export function preventIfSourceActivated(conditionData) {
  const conditions = new Set(Object.keys(CONFIG.A5E.conditions));
  const sourceId = conditionData.flags?.a5e?.source;
  const token = getTokenFromActor(conditionData.parent);

  // Guards
  if (!token) return true;
  if (!sourceId) return true;
  if (conditions.intersection(conditionData.statuses).size === 0) return true;
  const hasEffect = token.hasStatusEffect(sourceId);
  if (!hasEffect) return true;

  ui.notifications.error(`This condition cannot be removed as long as ${sourceId} is active.`);
  return false;
}
