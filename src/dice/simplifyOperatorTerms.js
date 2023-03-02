/**
 * A helper function to strip redundant operators from an array of RollTerms and to perform
 * arithmetic simplification.
 *
 * A new array of RollTerm objects is returned.
 *
 * @param {Array<RollTerm>} terms An array of RollTerm objects that form a valid roll formula.
 * @returns {Array<RollTerm>} A new array of RollTerm objects.
 */
export default function simplifyOperatorTerms(terms) {
  return terms.reduce((acc, term, i) => {
    const prior = acc[acc.length - 1];
    const ops = new Set([prior?.operator, term.operator]);

    // If the final terms is an operator term, ignore it.
    if ((i === terms.length - 1) && (term.operator)) return acc;

    // If one of the terms is not an operator, add the current term as is.
    if (ops.has(undefined)) acc.push(term);

    // Replace consecutive "+ -" operators with a "-" operator.
    else if ((ops.has('+')) && (ops.has('-'))) acc.splice(-1, 1, new OperatorTerm({ operator: '-' }));

    // Replace double "-" operators with a "+" operator.
    else if ((ops.has('-')) && (ops.size === 1)) acc.splice(-1, 1, new OperatorTerm({ operator: '+' }));

    // Don't include "+" operators that directly follow "+", "*", or "/".
    // Otherwise, add the term as is.
    else if (!ops.has('+')) acc.push(term);

    return acc;
  }, []);
}
