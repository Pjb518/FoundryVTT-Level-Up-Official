export default function prepareSkillChecks(rolls) {
  const counts = {};

  if (!rolls.length) return [];

  return rolls.map(([key, roll]) => {
    if (roll.label) return [key, roll.label];

    roll.skill ??= 'acr';

    const label = game.i18n.format('A5E.SkillCheck', {
      skill: game.i18n.localize(CONFIG.A5E.skills[roll.skill])
    });

    counts[roll.skill] ??= 0;
    counts[roll.skill] += 1;

    return [key, `${label} #${counts[roll.skill]}`];
  });
}
