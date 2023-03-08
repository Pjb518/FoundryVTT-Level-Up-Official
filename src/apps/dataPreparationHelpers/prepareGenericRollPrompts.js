export default function prepareGenericRollPrompts(prompts) {
  let count = 0;

  if (!prompts.length) return [];

  return prompts.map(([key, prompt]) => {
    if (prompt.label) return [key, prompt.label];

    const label = game.i18n.localize('A5E.Other');
    count += 1;

    return [key, `${label} #${count}`];
  });
}
