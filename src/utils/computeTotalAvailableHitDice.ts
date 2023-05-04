export default function computeTotalAvailableHitDice(actor: ActorA5e): number {
  return Object.values(actor.system.attributes.hitDice).reduce(
    (acc, { current }) => acc + current,
    0
  );
}
