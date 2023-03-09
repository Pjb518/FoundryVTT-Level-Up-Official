import simplifyOperatorTerms from './simplifyOperatorTerms';

/**
 * A helper function to construct a roll formula from an array of component values.
 *
 * Values which are undefined, null, or 0 are not included in the resulting formula, and some
 * arithmetic simplification is performed on the resulting formula for presentational purposes.
 *
 * @returns {string} A valid roll formula that can be passed to Roll.
 */
export default function constructRollFormula({ actor, formula }) {
  const rollData = actor.getRollData();

  const { terms } = new Roll(formula, rollData);
  const simplifiedTerms = simplifyOperatorTerms(terms);

  return Roll.getFormula(simplifiedTerms);
}
