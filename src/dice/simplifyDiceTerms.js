import simplifyOperatorTerms from './simplifyOperatorTerms';

export default function simplifyDiceTerms(terms) {
  // Do not attempt to simplify terms for rolls that feature muliplication or division
  if (terms.some((term) => term.operator === '*' || term.operator === '/')) return terms;

  const updatedTerms = simplifyOperatorTerms(terms).reduce((newTerms, term, index) => {
    if (index === 0) {
      newTerms.push(term);
      return newTerms;
    }

    const previousTerm = terms[index - 1];

    // Ignore OperatorTerms, as we'll be grabbing these alongside loose dice terms
    if (term instanceof OperatorTerm) return newTerms;

    // If the term is preceded by a subtraction operator, or the term is not a die, do not attempt
    // any further simplification. Simply return the term and the preceding operator.
    if (!(term instanceof DiceTerm) || previousTerm.operator === '-') {
      newTerms.push(previousTerm, term);
      return newTerms;
    }

    if (term.flavor) {
      const i = newTerms.findIndex(
        ({ faces, flavor }) => faces === term.faces && flavor === term.flavor
      );

      // If this term is not the first with this die size and flavor, merge its results into
      // the existing term.
      if (i !== -1) {
        const combinedCount = newTerms[i].number + term.number;
        const combinedResults = [...newTerms[i].results, ...term.results];

        const newTerm = new Die({
          faces: term.faces,
          number: combinedCount,
          results: combinedResults,
          options: {
            flavor: term.flavor
          }
        });

        newTerms.splice(i, 1, newTerm);
      } else {
        newTerms.push(previousTerm, term);
      }

      return newTerms;
    }

    const similarDieIndex = newTerms.findIndex(
      ({ faces, flavor }) => faces === term.faces && !flavor
    );

    if (similarDieIndex !== -1) {
      const combinedCount = newTerms[similarDieIndex].number + term.number;
      const combinedResults = [...newTerms[similarDieIndex].results, ...term.results];

      const newTerm = new Die({
        faces: term.faces,
        number: combinedCount,
        results: combinedResults
      });

      newTerms.splice(similarDieIndex, 1, newTerm);
    } else {
      newTerms.push(previousTerm, term);
    }

    return newTerms;
  }, []);

  updatedTerms.forEach((term) => { term._evaluated = true; });
  return updatedTerms;
}
