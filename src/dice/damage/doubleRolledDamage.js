import { localize } from '#runtime/svelte/helper';

export default async function doubleRolledDamage(baseRoll) {
  const terms = [
    ...baseRoll.terms,
    await new OperatorTerm({ operator: '+' }).evaluate(),
    await new NumericTerm({
      number: baseRoll.total,
      options: { flavor: localize('A5E.CritDamage') }
    }).evaluate()
  ];

  return terms;
}
