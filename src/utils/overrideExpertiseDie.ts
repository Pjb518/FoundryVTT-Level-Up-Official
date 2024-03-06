function getFlankingBonus(actor: typeof Actor): boolean {
  const targets = [...game.user.targets].map((t) => t.id);
  if (targets.length !== 1) return false;

  const targetId: string = actor.getFlag('a5e', 'flanking');
  if (!targetId) return false;

  const isFlanking: boolean = targetId === targets[0];
  return isFlanking;
}

export default function overrideExpertiseDie(actor: typeof Actor, dieCount: number): number {
  let addDie = 0;

  // Account for flanking
  const isFlanking: boolean = getFlankingBonus(actor);
  try {
    const setting: boolean = game.settings.get('a5e-flanking', 'flankingDND5EMode') ?? false;
    if (!setting && isFlanking) addDie += 1;
  } catch (err) { }

  const flag: number | undefined = actor.getFlag('a5e', 'effects.expertiseDie');
  if (flag) addDie += flag;

  return Math.clamped(dieCount + addDie, 0, 5);
}
