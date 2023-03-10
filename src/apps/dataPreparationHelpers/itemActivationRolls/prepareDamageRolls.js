export default function prepareDamageRolls(rolls) {
  const counts = {};

  if (!rolls.length) return [];

  return rolls.map(([key, roll]) => {
    if (!roll.label) {
      const label = game.i18n.format('A5E.DamageSpecific', {
        damageType: game.i18n.localize(CONFIG.A5E.damageTypes[roll.damageType] ?? '')
      });

      counts[roll.damageType] ??= 0;
      counts[roll.damageType] += 1;

      roll.label = `${label} #${counts[roll.damageType]}`;
    }

    return [key, roll];
  });
}
