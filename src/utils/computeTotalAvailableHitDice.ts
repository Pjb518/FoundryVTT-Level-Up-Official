export default function computeTotalAvailableHitDice(actor: any): number {
  // @ts-ignore TODO: Revisit this once an actor type is available
  return Object.values(actor.system.attributes.hitDice).reduce(
    (acc: number, { current }: { current: number }): number => acc + current,
    0
  );
}
