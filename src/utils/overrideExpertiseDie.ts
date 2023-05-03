/**
 *
 * @param actor
 * @param expertiseDie
 */
export default function overrideExpertiseDie(
  actor: { getFlag: (arg0: string, arg1: string) => number; },
  dieCount: number
): number {
  // @ts-ignore
  const flag: number | undefined = actor.getFlag('a5e', 'effects.expertiseDie');
  if (!flag) return dieCount;

  if (flag === 0) return 0;

  // @ts-ignore
  return Math.clamped(dieCount + flag, 0, 5);
}
