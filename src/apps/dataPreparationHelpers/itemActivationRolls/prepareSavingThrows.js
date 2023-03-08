export default function prepareSavingThrows(rolls) {
  const counts = {};

  if (!rolls.length) return [];

  return rolls.map(([key, roll]) => {
    roll.ability ??= 'str';

    if (!roll.label) {
      const label = game.i18n.format('A5E.SavingThrowSpecific', {
        ability: game.i18n.localize(CONFIG.A5E.abilities[roll.ability])
      });

      counts[roll.ability] ??= 0;
      counts[roll.ability] += 1;

      roll.label = `${label} #${counts[roll.ability]}`;
    }

    return [key, roll];
  });
}
