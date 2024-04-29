export default async function doubleDiceQuantityAndMods(baseRoll) {
  const Terms = foundry.dice.terms;

  return [
    ...baseRoll.terms.map((term) => {
      if (!(term instanceof Terms.FunctionTerm || term instanceof Terms.NumericTerm)) return term;

      return new Terms.NumericTerm({ number: term.total * 2, options: term.options }).evaluate();
    }),
    ...baseRoll.dice.flatMap((die) => {
      const operator = new Terms.OperatorTerm({ operator: '+' }).evaluate();

      const newDie = new Die({
        faces: die.faces, number: die.number, modifiers: die.modifiers, options: die.options
      }).evaluate();

      return [operator, newDie];
    })
  ];
}
