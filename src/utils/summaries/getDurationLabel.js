import { localize } from '#runtime/svelte/helper';

export default function getDurationLabel(item, action) {
  const duration = action?.duration;
  let durationLabel = '';

  if (foundry.utils.isEmpty(duration) || !duration.unit) return null;

  if (['instantaneous', 'permanent', 'special'].includes(duration.unit)) {
    durationLabel = CONFIG.A5E.timePeriods[duration.unit];
  } else if (duration.value === 0 || duration.value > 1) {
    durationLabel = `${duration.value} ${CONFIG.A5E.timePeriodsPlural[duration.unit]}`;
  } else {
    durationLabel = `${duration.value ?? 1} ${CONFIG.A5E.timePeriods[duration.unit]}`;
  }

  if (item?.system?.concentration) durationLabel += ` (${localize('A5E.SpellConcentration')})`;

  return durationLabel.trim();
}
