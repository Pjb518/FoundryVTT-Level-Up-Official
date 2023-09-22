import simplifyOperatorTerms from './simplifyOperatorTerms';

export default function simplifyDiceTerms(terms) {
  const termCategories = terms.reduce((newTerms, term, index) => {
    // The first element can be pushed directly to the newTerms object without further processing
    if (index === 0) {
      if (term instanceof NumericTerm || term instanceof PoolTerm) {
        newTerms.other.push(term);
        return newTerms;
      }

      if (term instanceof DiceTerm) {
        newTerms[term.faces] = term;
        return newTerms;
      }
    }

    const previousTerm = terms[index - 1];

    // Ignore OperatorTerms, as we'll be grabbing these alongside loose dice terms
    if (term instanceof OperatorTerm) return newTerms;

    if (!(term instanceof DiceTerm) || previousTerm.operator === '-') {
      newTerms.other.push(previousTerm, term);
      return newTerms;
    }

    if (term.flavor) {
      if (newTerms[`${term.faces}-${term.flavor}`]) {
        const combinedCount = newTerms[`${term.faces}-${term.flavor}`].number + term.number;
        const combinedResults = [...newTerms[`${term.faces}-${term.flavor}`].results, ...term.results];

        newTerms[`${term.faces}-${term.flavor}`] = new Die({
          faces: term.faces,
          number: combinedCount,
          results: combinedResults,
          options: {
            flavor: term.flavor
          }
        });
      } else {
        newTerms[`${term.faces}-${term.flavor}`] = term;
      }

      return newTerms;
    }

    if (newTerms[term.faces]) {
      const combinedCount = newTerms[term.faces].number + term.number;
      const combinedResults = [...newTerms[term.faces].results, ...term.results];

      newTerms[term.faces] = new Die({
        faces: term.faces,
        number: combinedCount,
        results: combinedResults
      });

      return newTerms;
    }

    newTerms[term.faces] = term;

    return newTerms;
  }, { other: [] });

  const operator = new OperatorTerm({ operator: '+' }).evaluate({ async: false });

  const combinedTerms = Object.entries(termCategories)
    .filter(([category]) => category !== 'other')
    .sort(([a], [b]) => b - a)
    .flatMap(([, term]) => ([term, operator]));

  combinedTerms.push(...termCategories.other, operator);

  return simplifyOperatorTerms(combinedTerms);
}
