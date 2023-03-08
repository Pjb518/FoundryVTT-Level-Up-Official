export default function prepareSkillChecks(rolls) {
  const counts = {};

  if (!rolls.length) return [];

  return rolls.map(([key, roll]) => {
    roll.skill ??= 'acr';

    if (!roll.label) {
      const label = game.i18n.format('A5E.SkillCheck', {
        skill: game.i18n.localize(CONFIG.A5E.skills[roll.skill])
      });

      counts[roll.skill] ??= 0;
      counts[roll.skill] += 1;

      roll.label = `${label} #${counts[roll.skill]}`;
    }

    return [key, roll];
  });
}
