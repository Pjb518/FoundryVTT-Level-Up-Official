import type { AttackRollData } from '../../../dataModels/item/actions/ActionRollsDataModel';

export default function prepareAttackRolls(
	rolls: [string, AttackRollData][],
): [string, AttackRollData][] {
	if (!rolls.length) return [];

	const [key, roll] = rolls[0];

	return [[key, roll]];
}
