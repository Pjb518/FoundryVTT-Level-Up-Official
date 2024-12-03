import type { SavingThrowPromptData } from '../../../dataModels/item/actions/ActionPromptsDataModel';

export default function prepareSavingThrowPrompts(
	prompts: [string, SavingThrowPromptData][],
): [string, SavingThrowPromptData][] {
	const counts: Record<string, number> = {};

	if (!prompts.length) return [];

	return prompts.map(([key, prompt]) => {
		prompt.ability ??= 'str';

		if (!prompt.label) {
			const label = game.i18n.format('A5E.SavingThrowSpecific', {
				ability: game.i18n.localize(CONFIG.A5E.abilities[prompt.ability]),
			});

			counts[prompt.ability] ??= 0;
			counts[prompt.ability] += 1;

			// @ts-expect-error
			prompt.defaultLabel = `${label} #${counts[prompt.ability]}`;
		}

		return [key, prompt];
	});
}
