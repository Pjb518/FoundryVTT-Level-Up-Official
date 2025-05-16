import type { GenericPromptData } from '../../../dataModels/item/actions/ActionPromptsDataModel';

export default function prepareGenericRollPrompts(
	prompts: [string, GenericPromptData][],
): [string, GenericPromptData][] {
	let count = 0;

	if (!prompts.length) return [];

	return prompts.map(([key, prompt]) => {
		if (!prompt.label) {
			const label = game.i18n.localize('A5E.actions.labels.other');
			count += 1;

			// @ts-expect-error
			prompt.defaultLabel = `${label} #${count}`;
		}

		return [key, prompt];
	});
}
