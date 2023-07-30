// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

export default function getCheckTitleAnnotation(messageData) {
  const { abilities } = CONFIG.A5E;
  const { abilityKey, cardType } = messageData;

  switch (cardType) {
    case 'skillCheck':
      return localize(abilities[abilityKey] ?? 'No Ability Selected');
    default:
      return null;
  }
}
