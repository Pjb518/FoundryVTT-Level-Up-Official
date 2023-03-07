export default function prepareAbilityCheckPrompts(prompts) {
  const counts = {};
  const abilityCheckPrompts = Object.entries(prompts).filter(([_, prompt]) => prompt.type === 'abilityCheck');

  if (!abilityCheckPrompts.length) return [];

  return abilityCheckPrompts.map(([key, prompt]) => {
    if (prompt.label) return prompt.label;

    const label = game.i18n.format('A5E.AbilityCheckSpecific', {
      ability: game.i18n.localize(CONFIG.A5E.abilities[prompt.ability])
    });

    counts[prompt.ability] ??= 0;
    counts[prompt.ability] += 1;

    return [key, `${label} #${counts[prompt.ability]}`];
  });
}
