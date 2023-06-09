export default function prepareActiveEffectPrompts(prompts, item) {
  let counts = 0;

  if (!prompts.length) return [];

  return prompts.map(([key, prompt]) => {
    prompt.effectUuid = item.effects.get(prompt.effectId).uuid;

    if (!prompt.label) {
      const label = game.i18n.format('A5E.Effect');
      counts += 1;
      prompt.defaultLabel = `${label} #${counts}`;
    }

    return [key, prompt];
  });
}
