import determineRollMode from './determineRollMode';
import type { OverrideFlags, OverrideRollModeOptions } from '../overrideRollMode';

export default function overrideSave(
  flags: OverrideFlags,
  rollMode: number,
  options: OverrideRollModeOptions
): number {
  const { ability, concentration, deathSave } = options;

  if (typeof flags.abilitySave?.all === 'number') return determineRollMode(rollMode, flags.abilitySave.all);
  if (!ability) {
    if (deathSave && typeof flags.deathSave === 'number') return determineRollMode(rollMode, flags.deathSave);

    return rollMode;
  }

  if (flags.abilitySave?.[ability] && typeof flags.abilitySave[ability] === 'number') return determineRollMode(rollMode, flags.abilitySave[ability]);

  if (concentration && ability === 'con' && typeof flags.concentration === 'number') return determineRollMode(rollMode, flags.concentration);

  return rollMode;
}
