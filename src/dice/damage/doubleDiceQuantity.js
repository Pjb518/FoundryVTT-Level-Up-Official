export default async function doubleDiceQuantity(baseRoll) {
  const roll = baseRoll.clone();

  roll.alter(2, 0, { multiplyNumeric: false });
  await roll.evaluate({ async: true });

  return roll.terms;
}
