import type { A5EActionData } from '../dataModels/item/actions/ActionDataModel';

export default function showActivationDialogSection(
	action: A5EActionData,
	selectedConsumers: string[],
	consumerTypes: string[] = [],
	scalingModes: string[] = [],
) {
	const hasConsumer =
		Object.values(action.consumers ?? {}).filter((c) => consumerTypes.includes(c.type)).length > 0;

	const consumerKeys = Object.entries(action.consumers ?? {}).reduce((acc, [key, { type }]) => {
		if (consumerTypes.includes(type)) acc.add(key);
		return acc;
	}, new Set<string>());

	if (!consumerKeys.some((k) => selectedConsumers.includes(k))) return false;

	const hasDamageScaling = Object.values(action.rolls ?? {})
		?.filter((r) => ['damage', 'healing'].includes(r.type))
		// @ts-expect-error
		?.some((dr) => scalingModes.includes(dr.scaling?.mode));

	const hasTargetScaling = scalingModes.includes(action.target?.scaling?.mode);
	const hasTemplateScaling = scalingModes.includes(action.area?.scaling?.mode);

	return hasConsumer || hasDamageScaling || hasTargetScaling || hasTemplateScaling;
}
