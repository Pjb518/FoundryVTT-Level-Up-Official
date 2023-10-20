import determineRollMode from './determineRollMode';
import type { OverrideFlags } from '../overrideRollMode';

export default function overrideCheck(
  flags: OverrideFlags,
  rollMode: number,
  ability: AbilityScoreKey | undefined
): number {
  if (typeof flags.abilityCheck?.all === 'number') return determineRollMode(rollMode, flags.abilityCheck.all);
  // eslint-disable-next-line no-param-reassign
  rollMode = determineRollMode(rollMode, flags.initiative);
  if (!ability) return rollMode;

  if (flags.abilityCheck?.[ability] && typeof flags.abilityCheck[ability] === 'number') return determineRollMode(rollMode, flags.abilityCheck[ability]);

  return rollMode;
}
