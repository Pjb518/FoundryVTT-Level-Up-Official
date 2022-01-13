/**
 * Get a Roll object which represents the initiative roll for this Combatant.
 *
 * @return {Roll}  The Roll instance to use for the combatant.
 */
export default async function getInitiativeRoll() {
  const formula = await this._getInitiativeFormula();
  const roll = CONFIG.Dice.D20Roll.create(formula);

  return roll.evaluate({ async: false });
}
