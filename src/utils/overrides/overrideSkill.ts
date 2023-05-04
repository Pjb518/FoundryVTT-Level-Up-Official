import determineRollMode from './determineRollMode';
import overrideCheck from './overrideCheck';
import type { OverrideFlags, OverrideRollModeOptions } from '../overrideRollMode';

export default function overrideSkill(
  flags: OverrideFlags,
  rollMode: number,
  options: OverrideRollModeOptions
): number {
  const { ability, skill } = options;

  // Early exit if ability is being overridden
  const override = overrideCheck(flags, rollMode, ability);
  if (override !== rollMode) return override;

  if (typeof flags.skillCheck?.all === 'number') return determineRollMode(rollMode, flags.skillCheck.all);
  if (!skill) return rollMode;

  if (flags.skillCheck?.[skill] && typeof flags.skillCheck[skill] === 'number') return determineRollMode(rollMode, flags.skillCheck[skill]);

  return rollMode;
}
