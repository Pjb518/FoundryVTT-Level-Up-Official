// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import getAbilityCheckPromptTitle from './getAbilityCheckPromptTitle';
import getEffectPromptTitle from './getEffectPromptTitle';
import getSavingThrowPromptTitle from './getSavingThrowPromptTitle';
import getSkillCheckPromptTitle from './getSkillCheckPromptTitle';

export default function getPromptTitle(prompt, actorId) {
  switch (prompt.type) {
    case 'abilityCheck':
      return getAbilityCheckPromptTitle(prompt);
    case 'effect':
      return getEffectPromptTitle(prompt);
    case 'savingThrow':
      return getSavingThrowPromptTitle(prompt, actorId);
    case 'skillCheck':
      return getSkillCheckPromptTitle(prompt);
    default:
      return prompt?.label || localize('A5E.Other');
  }
}
