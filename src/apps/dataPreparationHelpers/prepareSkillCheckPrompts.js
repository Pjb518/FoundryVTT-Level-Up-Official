export default function prepareSkillCheckPrompts(prompts) {
  const counts = {};
  const skillCheckPrompts = Object.entries(prompts).filter(([_, prompt]) => prompt.type === 'skillCheck');

  if (!skillCheckPrompts.length) return [];

  return skillCheckPrompts.map(([key, prompt]) => {
    if (prompt.label) return prompt.label;

    const label = game.i18n.format('A5E.SkillCheck', {
      skill: game.i18n.localize(CONFIG.A5E.skills[prompt.skill])
    });

    counts[prompt.skill] ??= 0;
    counts[prompt.skill] += 1;

    return [key, `${label} #${counts[prompt.skill]}`];
  });
}
