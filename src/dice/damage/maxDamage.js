export default async function maxDamagePlusRoll(baseRoll) {
  const roll = baseRoll.clone();
  await roll.evaluate({ maximize: true });

  return roll.terms;
}
