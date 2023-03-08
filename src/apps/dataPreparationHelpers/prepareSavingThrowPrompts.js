export default function prepareSavingThrowPrompts(prompts) {
  const counts = {};
  const savingThrowPrompts = Object.entries(prompts).filter(([_, prompt]) => prompt.type === 'savingThrow');

  if (!savingThrowPrompts.length) return [];

  return savingThrowPrompts.map(([key, prompt]) => {
    if (prompt.label) return [key, prompt.label];

    const label = game.i18n.format('A5E.SavingThrowSpecific', {
      ability: game.i18n.localize(CONFIG.A5E.abilities[prompt.ability])
    });

    counts[prompt.ability] ??= 0;
    counts[prompt.ability] += 1;

    return [key, `${label} #${counts[prompt.ability]}`];
  });
}
