import type { ItemA5e } from '../../../documents/item/item';

export default function prepareActiveEffectPrompts(
  prompts: [string, any][],
  item: ItemA5e
): [string, any][] {
  let counts = 0;

  if (!prompts.length) return [];

  return prompts.reduce((acc, [key, prompt]) => {
    prompt.effectUuid = item.effects.get(prompt.effectId)?.uuid;
    if (!prompt.effectUuid) return acc;

    if (!prompt.label) {
      const label = game.i18n.format('A5E.Effect');
      counts += 1;
      prompt.defaultLabel = `${label} #${counts}`;
    }

    acc.push([key, prompt]);
    return acc;
  }, [] as any[]);
}
