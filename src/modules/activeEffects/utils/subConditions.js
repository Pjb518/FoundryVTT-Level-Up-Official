/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Create Active Effect
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export async function addSubConditions(conditionData) {
  const conditions = Object.keys(CONFIG.A5E.conditions);
  const token = conditionData?.parent?.parent;

  // Guards
  if (!token) return;
  if (!conditions.includes(conditionData.flags?.core?.statusId)) return;
  if (!conditionData.flags?.a5e?.conditions) return;

  // Set other conditions
  for (const c of conditionData.flags.a5e.conditions) {
    const effect = CONFIG.statusEffects.find((e) => e.id === c);
    await token.toggleActiveEffect(effect, { active: true });
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Delete Active Effect
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export async function removeSubConditions(conditionData) {
  const conditions = Object.keys(CONFIG.A5E.conditions);
  const token = conditionData?.parent?.parent;

  // Guards
  if (!token) return;
  if (!conditions.includes(conditionData.flags?.core?.statusId)) return;
  if (!conditionData.flags?.a5e?.conditions) return;

  // Set other conditions
  for (const c of conditionData.flags.a5e.conditions) {
    const effect = CONFIG.statusEffects.find((e) => e.id === c);
    await token.toggleActiveEffect(effect, { active: false });
  }
}
