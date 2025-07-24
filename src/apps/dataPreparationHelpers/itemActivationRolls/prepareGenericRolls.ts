import type { GenericRollData } from '../../../dataModels/item/actions/ActionRollsDataModel';

export default function prepareGenericRolls(
	rolls: [string, GenericRollData][],
): [string, GenericRollData][] {
	let count = 0;

	if (!rolls.length) return [];

	return rolls.map(([key, roll]) => {
		if (!roll.label) {
			const label = game.i18n.localize('A5E.actions.labels.other');
			count += 1;

			// @ts-expect-error
			roll.defaultLabel = `${label} #${count}`;
		}

		return [key, roll];
	});
}
