/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import getTokenFromActor from '../../../utils/getTokenFromActor';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Delete Active Effect
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default function preventIfSourceActivated(conditionData, options, userId) {
  // Validations
  if (game.user.id !== userId) return true;
  if (conditionData.parent.documentName !== 'Actor') return true;

  const conditions = new Set(Object.keys(CONFIG.A5E.conditions));
  const sourceId = conditionData.flags?.a5e?.source;
  const token = getTokenFromActor(conditionData.parent);

  // Guards
  if (!token) return true;
  if (!sourceId) return true;
  if (conditions.intersection(conditionData.statuses).size === 0) return true;
  const hasEffect = token.hasStatusEffect(sourceId);
  if (!hasEffect) return true;

  ui.notifications.warn(`This condition cannot be removed as long as ${sourceId} is active.`);
  return false;
}
