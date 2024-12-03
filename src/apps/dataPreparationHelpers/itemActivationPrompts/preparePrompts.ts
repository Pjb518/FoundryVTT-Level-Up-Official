import type { ItemA5e } from '../../../documents/item/item';

import prepareAbilityCheckPrompts from './prepareAbilityCheckPrompts';
import prepareActiveEffectPrompts from './prepareActiveEffectPrompts';
import prepareGenericRollPrompts from './prepareGenericRollPrompts';
import prepareSavingThrowPrompts from './prepareSavingThrowPrompts';
import prepareSkillCheckPrompt from './prepareSkillCheckPrompts';

const promptHandlerMap = {
	abilityCheck: prepareAbilityCheckPrompts,
	effect: prepareActiveEffectPrompts,
	savingThrow: prepareSavingThrowPrompts,
	skillCheck: prepareSkillCheckPrompt,
	generic: prepareGenericRollPrompts,
} as const;

export type PromptHandlerMap = typeof promptHandlerMap;

export type PromptHandlerTypes = keyof PromptHandlerMap;

export interface PromptHandlerReturnType {
	abilityCheck?: ReturnType<typeof prepareAbilityCheckPrompts>;
	effect?: ReturnType<typeof prepareActiveEffectPrompts>;
	savingThrow?: ReturnType<typeof prepareSavingThrowPrompts>;
	skillCheck?: ReturnType<typeof prepareSkillCheckPrompt>;
	generic?: ReturnType<typeof prepareGenericRollPrompts>;
}

export default function preparePrompts(item: ItemA5e, actionId: string): PromptHandlerReturnType {
	const { prompts } = item.actions.get(actionId)!;

	const promptsByType = Object.entries(prompts ?? {}).reduce((acc, [key, prompt]) => {
		acc[prompt.type] ??= [];
		acc[prompt.type].push([key, prompt]);

		return acc;
	}, {});

	return Object.entries(promptsByType).reduce((acc, [promptType, _prompts]) => {
		if (typeof promptHandlerMap[promptType] === 'function') {
			acc[promptType] = promptHandlerMap[promptType](_prompts, item) ?? [];
		}

		return acc;
	}, {} as PromptHandlerReturnType);
}
