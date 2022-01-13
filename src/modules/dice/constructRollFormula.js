import simplifyOperatorTerms from './simplifyOperatorTerms';

/**
 * A helper function to construct a roll formula from an array of component values.
 *
 * Values which are undefined, null, or 0 are not included in the resulting formula, and some
 * arithmetic simplification is performed on the resulting formula for presentational purposes.
 *
 * @param {string[]} parts An array of roll terms in string format.
 * @throws An error when the provided terms produce an invalid roll formula.
 * @returns {string} A valid roll formula that can be passed to Roll.
 */
export default function constructRollFormula(parts, rollData) {
  const formula = parts.filter((part) => Boolean(part) && part !== '0').join(' + ');
  const isValid = Roll.validate(formula);

  if (!isValid) throw Error('Invalid roll formula');

  const { terms } = new Roll(formula, rollData);
  const simplifiedTerms = simplifyOperatorTerms(terms);

  return Roll.getFormula(simplifiedTerms);
}
