export default async function doubleDiceQuantity(baseRoll) {
  return [
    ...baseRoll.terms,
    ...baseRoll.dice.flatMap((die) => {
      const operator = new OperatorTerm({ operator: '+' }).evaluate();

      const newDie = new Die({
        faces: die.faces, number: die.number, modifiers: die.modifiers, options: die.options
      }).evaluate();

      return [operator, newDie];
    })
  ];
}
