// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

export default function getCheckLabel(messageData) {
  const { abilities, skills } = CONFIG.A5E;
  const { abilityKey, skillKey } = messageData;
  const ability = localize(abilities[abilityKey]);
  const skill = skills[skillKey];

  switch (messageData.cardType) {
    case 'abilityCheck':
      return localize('A5E.AbilityCheckSpecific', { ability });
    case 'hitDice':
      return messageData.title;
    case 'savingThrow':
      return messageData.saveType === 'concentration'
        ? localize('A5E.ConcentrationCheck')
        : localize('A5E.SavingThrowSpecific', { ability });
    case 'skillCheck':
      return ability ? localize('A5E.SkillCheckAbility', { skill, ability }) : localize('A5E.SkillCheck', { skill });
    default:
      return null;
  }
}
