export default function prepareHealingRolls(rolls) {
  const counts = {};

  if (!rolls.length) return [];

  return rolls.map(([key, roll]) => {
    if (!roll.label) {
      roll.healingType ??= 'healing';

      const label = game.i18n.localize(CONFIG.A5E.healingTypes[roll.healingType] ?? '');

      counts[roll.healingType] ??= 0;
      counts[roll.healingType] += 1;

      roll.defaultLabel = `${label} #${counts[roll.healingType]}`;
    }
    return [key, roll];
  });
}
