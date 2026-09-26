import { getDeterministicBonus } from '../dice/getDeterministicBonus.ts';

export default function getTotalHp(actor: Actor.OfType<'character'>) {
	if (!actor) return 0;

	const classesHp: [string, string][] = Object.values(actor.classes ?? {}).reduce(
		(acc: [string, string][], cls: any) => {
			const maxHP = cls.maxHP ?? 0;
			if (!maxHP) return acc;

			acc.push([maxHP, cls.name]);
			return acc;
		},
		[] as [string, string][],
	);

	const maxHp = classesHp.map(([hp]) => hp).join(' + ');
	const conMod = (actor.system?.abilities?.con?.check?.mod ?? 0) * actor.levels.character;
	const tempBonus = actor.system?.attributes?.hp?.bonus ?? 0;
	const hpBonuses =
		getDeterministicBonus(actor.BonusesManager.getHitPointsBonusFormula(), actor.getRollData()) ??
		0;

	const totalHp = getDeterministicBonus(
		`${maxHp} + ${conMod} + ${tempBonus} + ${hpBonuses}`,
		actor.getRollData(),
	);

	return totalHp;
}
