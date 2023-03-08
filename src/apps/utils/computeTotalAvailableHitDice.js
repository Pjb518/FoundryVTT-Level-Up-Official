export default function computeTotalAvailableHitDice(actor) {
  return Object.values(actor.system.attributes.hitDice).reduce(
    (acc, { current }) => acc + current,
    0
  );
}
