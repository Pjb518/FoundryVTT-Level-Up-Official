import prepareAbilityCheckPrompts from './prepareAbilityCheckPrompts';
import prepareGenericRollPrompts from './prepareGenericRollPrompts';
import prepareSavingThrowPrompts from './prepareGenericRollPrompts';
import prepareSkillCheckPrompt from './prepareSkillCheckPrompts';

const promptHandlerMap = {
  abilityCheck: prepareAbilityCheckPrompts,
  savingThrow: prepareSavingThrowPrompts,
  skillCheck: prepareSkillCheckPrompt,
  generic: prepareGenericRollPrompts
};

export default function preparePrompts(prompts) {
  const promptsByType = Object.entries(prompts).reduce((acc, [key, prompt]) => {
    acc[prompt.type] ??= [];
    acc[prompt.type].push([key, prompt]);

    return acc;
  }, {});

  console.log(promptsByType);

  return Object.entries(promptsByType).reduce((acc, [promptType, _prompts]) => {
    acc[promptType] = [...promptHandlerMap[promptType](_prompts)];
    return acc;
  }, {});
}
