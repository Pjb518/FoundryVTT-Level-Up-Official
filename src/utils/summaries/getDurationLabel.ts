import type { Action } from 'types/action';
import type { ItemA5e } from '../../documents/item/item';

import { localize } from '#runtime/svelte/helper';

export default function getDurationLabel(item: ItemA5e, action: Action) {
  const { duration } = action;
  let durationLabel = '';

  if (foundry.utils.isEmpty(duration) || !duration.unit) return '';

  if (['instantaneous', 'permanent', 'special'].includes(duration.unit)) {
    durationLabel = CONFIG.A5E.timePeriods[duration.unit];
  } else if (duration.value === 0 || duration.value > 1) {
    durationLabel = `${duration.value} ${CONFIG.A5E.timePeriodsPlural[duration.unit]}`;
  } else {
    durationLabel = `${duration.value ?? 1} ${CONFIG.A5E.timePeriods[duration.unit]}`;
  }

  if (item.isType('spell') && item?.system?.concentration) {
    durationLabel += ` (${localize('A5E.SpellConcentration')})`;
  }

  return durationLabel.trim();
}
