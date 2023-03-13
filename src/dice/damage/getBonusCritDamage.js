export default async function getBonusCritDamage(critBonus) {
  const bonusDamageRoll = await new Roll(critBonus).evaluate({ async: true });

  return [
    await new OperatorTerm({ operator: '+' }).evaluate({ async: true }),
    ...bonusDamageRoll.terms
  ];
}
