import type { BaseActorA5e } from '../documents/actor/base';

export default function computeTotalAvailableHitDice(actor: BaseActorA5e): number {
  return Object.values(actor.system.attributes.hitDice).reduce(
    // @ts-ignore
    (acc: number, { current }: { current: number }): number => acc + current,
    0
  ) as number;
}
