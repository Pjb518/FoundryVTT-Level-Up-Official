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
  generic: prepareGenericRollPrompts
};

export default function preparePrompts(prompts, item) {
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
  }, {});
}
