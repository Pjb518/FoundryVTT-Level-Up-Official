export default function prepareGenericRollPrompts(prompts) {
  let count = 0;

  if (!prompts.length) return [];

  return prompts.map(([key, prompt]) => {
    if (!prompt.label) {
      const label = game.i18n.localize('A5E.Other');
      count += 1;

      prompt.label = `${label} #${count}`;
    }

    return [key, prompt];
  });
}
