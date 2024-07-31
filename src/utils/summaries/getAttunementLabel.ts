import type ObjectItemA5e from '../../documents/item/object';

import { localize } from '#runtime/svelte/helper';

export default function getAttunementLabel(item: ObjectItemA5e) {
  const { requiresAttunement, attuned } = item.system;

  if (!requiresAttunement) return '';
  if (attuned) return localize('A5E.Attuned');
  if (!item.actor) return localize('A5E.AttunementRequiredPrompt');

  return `${localize('A5E.AttunementRequiredPrompt')} - ${localize('A5E.AttunedNot')}`;
}
