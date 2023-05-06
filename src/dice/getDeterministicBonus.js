import zeroDiceTerms from './zeroDiceTerms';

/**
 * A helper function for determining the deterministic bonuses for a given ability score or skill.
 *
 * @param {string} formula   A roll formula.
 * @param {Object} rollData  Actor data used to determine the value of attribute references used in
 *                           the roll formula.
 *
 * @returns {?number}        The resulting deterministic bonus, or null is one could not be
 *                           calculated.
 */
export default function getDeterministicBonus(formula, rollData = {}) {
  const zeroedFormula = zeroDiceTerms(formula.toString() || '0', rollData);

  const roll = new Roll(zeroedFormula, rollData);
  if (!Roll.validate(roll.formula)) throw Error('Invalid roll formula');

  // TODO: Can possibly remove this version
  // Make a dummy roll and calculate what portion of that came from dice.
  const result = roll.roll({ async: false });
  const diceTotal = roll.dice.reduce((acc, curr) => acc + curr.total, 0);

  // Return the roll total minus the dice component.
  return result.total - diceTotal;
}
