export default function zeroDiceTerms(formula, rollData) {
  const subTerms = Roll._splitParentheses(formula);
  const component = subTerms.map((term) => {
    // Create parsed terms and remove any dice terms at top level.
    let parsedTerms = [];
    if (typeof term === 'string' || term instanceof ParentheticalTerm) {
      parsedTerms = Roll.parse(term.term ?? term, rollData).map((t) => {
        if (t instanceof DiceTerm) return new NumericTerm({ number: 0 });
        return t;
      });
    }

    // Create Modified Formula without dice terms
    const modifiedFormula = Roll.getFormula(parsedTerms);

    // Return modified formula if string type term and if the string has no bad terms in it.
    if ((typeof term === 'string' || term instanceof ParentheticalTerm) && parsedTerms.every(
      (t) => !(t instanceof ParentheticalTerm || t instanceof MathTerm || t instanceof DiceTerm)
    )) return modifiedFormula;

    // Rerun for terms that have parenthesis in them.
    if (parsedTerms.find((t) => t instanceof ParentheticalTerm)) {
      return zeroDiceTerms(modifiedFormula);
    }

    // Rerun for terms that have complex math formulas in them.
    if (parsedTerms.find((t) => t instanceof MathTerm)) {
      return zeroDiceTerms(modifiedFormula);
    }

    // Return if term isn't deterministic. This also takes care of math terms with
    // dice terms. Eg: `min(1d4, 1) = 0`
    if (!term.isDeterministic) return '0';

    // Return math term as a formula.
    if (term instanceof MathTerm) {
      const f = term.terms.join(', ');
      return `${term.fn}(${f})`;
    }

    // Return modified formula as an edge case.
    return modifiedFormula;
  }).join(' ');

  return `(${component})`;
}
