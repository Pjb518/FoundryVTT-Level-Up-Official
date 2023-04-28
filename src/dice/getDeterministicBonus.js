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
  const roll = new Roll(formula.toString() || '0', rollData);
  if (!Roll.validate(roll.formula)) throw Error('Invalid roll formula');

  // If the formula contains complex terms, return null to avoid giving incorrect results.
  const notDeterministic = roll.terms.find((term) => {
    const deterministicParenthetical = term instanceof ParentheticalTerm && !term.isDeterministic;
    const deterministicMathTerm = term instanceof MathTerm && !term.isDeterministic;

    return deterministicMathTerm || deterministicParenthetical;
  });

  if (notDeterministic) return null;

  // Make a dummy roll and calculate what portion of that came from dice.
  const result = roll.roll({ async: false });
  const diceTotal = roll.dice.reduce((acc, curr) => acc + curr.total, 0);

  // Return the roll total minus the dice component.
  return result.total - diceTotal;
}

function zeroDiceTerms(formula) {
  const subTerms = Roll._splitParentheses(formula);

  const component = subTerms.map((term) => {
    if (!(term instanceof ParentheticalTerm || term instanceof MathTerm)) return term;

    const parsedTerms = Roll.parse(term.term);
    if (parsedTerms.find((t) => t instanceof ParentheticalTerm)) {
      return zeroDiceTerms(term.term);
    }

    if (parsedTerms.find((t) => t instanceof MathTerm)) {
      return zeroDiceTerms(term.term);
    }

    if (!term.isDeterministic) return '0';

    if (term instanceof MathTerm) {
      const f = term.terms.join(', ');
      return `${term.fn}(${f})`;
    }

    return term;
  }).join(' ');

  return `(${component})`;
}
