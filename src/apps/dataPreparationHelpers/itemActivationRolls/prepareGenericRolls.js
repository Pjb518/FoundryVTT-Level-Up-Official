export default function prepareGenericRolls(rolls) {
  let count = 0;

  if (!rolls.length) return [];

  return rolls.map(([key, roll]) => {
    if (!roll.label) {
      const label = game.i18n.localize('A5E.Other');
      count += 1;

      roll.label = `${label} #${count}`;
    }

    return [key, roll];
  });
}
