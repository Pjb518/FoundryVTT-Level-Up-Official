import determineRollMode from './determineRollMode';

import type { OverrideFlags } from '../overrideRollMode';

export default function overrideAttack(
  flags: OverrideFlags,
  rollMode: number,
  attackType: string | undefined
) {
  if (typeof flags.attack?.all === 'number') return determineRollMode(rollMode, flags.attack.all);
  if (!attackType) return rollMode;

  if (flags.attack?.[attackType] && typeof flags.attack[attackType] === 'number') return determineRollMode(rollMode, flags.attack[attackType]);

  return rollMode;
}
