export default function prepareSkillCheckPrompts(prompts) {
  const counts = {};

  if (!prompts.length) return [];

  return prompts.map(([key, prompt]) => {
    if (prompt.label) return [key, prompt.label];

    prompt.skill ??= 'acr';

    const label = game.i18n.format('A5E.SkillCheck', {
      skill: game.i18n.localize(CONFIG.A5E.skills[prompt.skill])
    });

    counts[prompt.skill] ??= 0;
    counts[prompt.skill] += 1;

    return [key, `${label} #${counts[prompt.skill]}`];
  });
}
