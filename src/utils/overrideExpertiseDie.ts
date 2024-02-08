/**
 *
 * @param actor
 * @param expertiseDie
 */
export default function overrideExpertiseDie(
  actor: { getFlag: (arg0: string, arg1: string) => any; },
  dieCount: number
): number {
  let addDie = 0;

  // Account for flanking
  const isFlanking: boolean = actor.getFlag('a5e', 'flanking');
  if (isFlanking) addDie += 1;

  const flag: number | undefined = actor.getFlag('a5e', 'effects.expertiseDie');
  if (flag) addDie += flag;

  return Math.clamped(dieCount + addDie, 0, 5);
}
