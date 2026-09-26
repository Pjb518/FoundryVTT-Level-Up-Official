import type { ActorA5E } from '../documents/actor/actor';

export default function computeTotalAvailableHitDice(actor: ActorA5E): number {
	return Object.values(actor.system.attributes.hitDice).reduce(
		// @ts-expect-error
		(acc: number, { current }: { current: number }): number => acc + current,
		0,
	) as number;
}
