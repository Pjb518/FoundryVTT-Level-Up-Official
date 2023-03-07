import getPromptLabel from '../utils/getPromptLabel';

const SORT_MAP = {
  abilityCheck: 0,
  skillCheck: 1,
  savingThrow: 2,
  generic: 3
};

export default function preparePrompts(prompts) {
  // Group prompts of a similar type and generate a label for each prompt
  const promptsByType = Object.entries(prompts).reduce((acc, [key, prompt]) => {
    acc[prompt.type] ??= [];
    acc[prompt.type].push([key, getPromptLabel(prompt)]);

    return acc;
  }, {});

  // Sort the prompt groups according to the sort map
  const sortedPromptsByType = Object.entries(promptsByType).sort(
    ([a], [b]) => SORT_MAP[a] - SORT_MAP[b]
  );

  // Return just the prompts in a format similar to Object.entries
  return sortedPromptsByType.flatMap(([_, _prompts]) => _prompts);
}
