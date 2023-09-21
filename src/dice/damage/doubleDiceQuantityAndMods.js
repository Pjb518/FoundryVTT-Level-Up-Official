export default async function doubleDiceQuantityAndMods(baseRoll) {
  return [
    ...baseRoll.terms.map((term) => {
      if (!(term instanceof MathTerm || term instanceof NumericTerm)) return term;

      return new NumericTerm({ number: term.total * 2, options: term.options }).evaluate();
    }),
    ...baseRoll.dice.flatMap((die) => {
      const operator = new OperatorTerm({ operator: '+' }).evaluate();

      const newDie = new Die({
        faces: die.faces, number: die.number, modifiers: die.modifiers, options: die.options
      }).evaluate();

      return [operator, newDie];
    })
  ];
}
