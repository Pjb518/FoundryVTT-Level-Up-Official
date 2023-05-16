import ModifierManager from '../managers/ModifierManager';

import constructD20RollFormula from '../dice/constructD20RollFormula';

export default function getRollFormula(actor, rollData = {}) {
  const modifierManager = new ModifierManager(actor, rollData);

  return constructD20RollFormula({
    actor,
    rollMode: rollData.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
    minRoll: rollData.minRoll ?? 1,
    modifiers: modifierManager.getModifiers()
  }).rollFormula;
}
