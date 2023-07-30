import { localize } from '#runtime/svelte/helper';

export default async function doubleRolledDamage(baseRoll) {
  const terms = [
    ...baseRoll.terms,
    await new OperatorTerm({ operator: '+' }).evaluate({ async: true }),
    await new NumericTerm({
      number: baseRoll.total,
      options: { flavor: localize('A5E.CritDamage') }
    }).evaluate({ async: true })
  ];

  return terms;
}
