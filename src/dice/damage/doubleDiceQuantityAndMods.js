export default async function doubleDiceQuantityAndMods(baseRoll) {
  const roll = baseRoll.clone();

  roll.alter(2, 0, { multiplyNumeric: true });
  await roll.evaluate({ async: true });

  return roll.terms;
}
