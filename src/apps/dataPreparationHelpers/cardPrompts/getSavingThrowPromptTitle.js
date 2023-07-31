// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

export default function getSavingThrowPromptTitle(prompt, actorId) {
  const { abilities } = CONFIG.A5E;

  if (game.settings.get('a5e', 'protectRolls') ?? false) {
    // eslint-disable-next-line no-undef
    const actor = fromUuidSync(actorId);

    if (actor && actor.type !== 'character' && actor.permission < 2) {
      return localize('A5E.RollPromptSavingThrow', {
        ability: abilities[prompt.ability]
      });
    }
  }

  return localize('A5E.RollPromptSavingThrowWithDC', {
    ability: abilities[prompt.ability],
    dc: prompt.dc
  });
}
