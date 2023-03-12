import simplifyOperatorTerms from './simplifyOperatorTerms';

/**
 * A helper function to construct a roll formula from an array of component values.
 *
 * Values which are undefined, null, or 0 are not included in the resulting formula, and some
 * arithmetic simplification is performed on the resulting formula for presentational purposes.
 *
 * @returns {string} A valid roll formula that can be passed to Roll.
 */
export default function constructRollFormula({ actor, formula, modifiers }) {
  const rollData = actor.getRollData();

  const parts = [
    formula,
    ...(modifiers ?? []).map(({ label, value }) => {
      if (value && value !== 0) {
        return label ? `${value}[${label}]` : value;
      }

      return null;
    })
  ];

  const { terms } = new Roll(
    parts.filter((part) => part && part !== '0').join(' + '),
    rollData
  );

  const simplifiedTerms = simplifyOperatorTerms(terms);

  return { rollFormula: Roll.getFormula(simplifiedTerms) };
}
