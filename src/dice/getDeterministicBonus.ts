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
export function getDeterministicBonus(
  formula: string | number,
  rollData: Record<string, any> = {},
  options: { strict?: boolean } = {},
): number {
  if (formula === null || formula === undefined) return 0;
  if (typeof formula === "string" && formula.trim() === "") return 0;
  if (typeof formula === "number" && formula === 0) return 0;

  // eslint-disable-next-line no-param-reassign
  if (typeof formula === "number") formula = formula.toString();

  options.strict ??= false;

  let roll;
  try {
    roll = new Roll(formula, rollData);
    if (!Roll.validate(roll.formula)) throw Error("Invalid roll formula");
  } catch (error) {
    ui.notifications?.error(`Invalid roll formula: ${formula}`);
    return null;
  }

  // TODO: Dice improvements - Make it not 0 out full function terms
  const result = roll.evaluateSync({ strict: options.strict });
  return result.total ?? 0;
}
