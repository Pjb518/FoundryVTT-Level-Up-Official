import constructD20Term from './constructD20Term';
import simplifyOperatorTerms from './simplifyOperatorTerms';

/**
 * A helper function to construct a roll formula from an array of component values.
 *
 * Values which are undefined, null, or 0 are not included in the resulting formula, and some
 * arithmetic simplification is performed on the resulting formula for presentational purposes.
 *
 * @returns {string} A valid roll formula that can be passed to Roll.
 */
export default function constructD20RollFormula({
  actor, minRoll, modifiers, rollMode
}) {
  const rollData = actor.getRollData();
  const parts = [];

  parts.push(constructD20Term({ actor, minRoll, rollMode }));

  parts.push(...modifiers.map(({ label, value }) => {
    if (value && value !== 0) {
      return label ? `${value}[${label}]` : value;
    }

    return null;
  }));

  const formula = parts.filter((part) => Boolean(part) && part !== '0').join(' + ');

  const { terms } = new Roll(formula, rollData);
  const simplifiedTerms = simplifyOperatorTerms(terms);

  return Roll.getFormula(simplifiedTerms);
}
