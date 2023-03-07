export default function prepareSavingThrowPrompts(prompts) {
  let count = 0;
  const savingThrowPrompts = Object.entries(prompts).filter(([_, prompt]) => prompt.type === 'generic');

  if (!savingThrowPrompts.length) return [];

  return savingThrowPrompts.map(([key, prompt]) => {
    if (prompt.label) return [key, prompt.label];

    const label = game.i18n.localize('A5E.Other');
    count += 1;

    return [key, `${label} #${count}`];
  });
}
