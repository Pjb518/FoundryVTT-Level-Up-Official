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
export default function getDeterministicBonus(
  formula: string | number,
  rollData: Record<string, any> = {}
): number | null {
  if (!formula) return null;
  const roll = new Roll(formula, rollData);
  if (!Roll.validate(roll.formula)) throw Error('Invalid roll formula');

  // TODO: Dice improvements - Make it not 0 out full function terms
  const result = roll.evaluateSync({ strict: false });
  return result.total ?? 0;
}
