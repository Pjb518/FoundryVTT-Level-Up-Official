import { localize } from "#utils/localization/localize.ts";

export default async function doubleRolledDamage(baseRoll) {
  const Terms = foundry.dice.terms;

  const terms = [
    ...baseRoll.terms,
    new Terms.OperatorTerm({ operator: "+" }),
    await new Terms.NumericTerm({
      number: baseRoll.total,
      options: { flavor: localize("A5E.CritDamage") },
    }).evaluate(),
  ];

  return terms;
}
