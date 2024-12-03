import type { A5EActionData } from '../dataModels/item/actions/ActionDataModel';

export default function getActionScalingModes(action: A5EActionData): Set<string> {
	const scalableRolls = Object.values(action.rolls ?? {}).filter((r: BaseRoll) =>
		['damage', 'healing'].includes(r.type),
	);

	const scalingModes: Set<string> = scalableRolls.reduce((acc, r) => {
		// @ts-expect-error
		if (r.scaling?.mode) acc.add(r.scaling?.mode);
		return acc;
	}, new Set<string>());

	if (action.target?.scaling?.mode) scalingModes.add(action.target?.scaling?.mode);
	if (action.area?.scaling?.mode) scalingModes.add(action.area?.scaling?.mode);

	return scalingModes;
}
