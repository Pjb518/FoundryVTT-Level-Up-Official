import getExpertiseDieSize from '../utils/getExpertiseDieSize';
import simplifyOperatorTerms from './simplifyOperatorTerms';

/**
 * A helper function to construct a roll formula from an array of component values.
 *
 * Values which are undefined, null, or 0 are not included in the resulting formula, and some
 * arithmetic simplification is performed on the resulting formula for presentational purposes.
 *
 * @returns {string} A valid roll formula that can be passed to Roll.
 */
export default function constructRollFormula(
  actor,
  modifiers,
  expertiseDie,
  rollMode,
  situationalMods
) {
  const rollData = actor.getRollData();
  const expertiseDieSize = getExpertiseDieSize(expertiseDie);
  const parts = [];

  if (rollMode === CONFIG.A5E.ROLL_MODE.ADVANTAGE) parts.push('2d20kh');
  else if (rollMode === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) parts.push('2d20kl');
  else parts.push('1d20');

  parts.push(
    modifiers.map(({ label, value }) => {
      if (value && value !== 0) {
        return label ? `${value}[${label}]` : value;
      }

      return null;
    }).join(' + ')
  );

  if (expertiseDieSize) parts.push(`${expertiseDieSize}[Expertise Die]`);

  parts.push(situationalMods);

  const formula = parts.filter((part) => Boolean(part) && part !== '0').join(' + ');

  const { terms } = new Roll(formula, rollData);
  const simplifiedTerms = simplifyOperatorTerms(terms);

  return Roll.getFormula(simplifiedTerms);
}
