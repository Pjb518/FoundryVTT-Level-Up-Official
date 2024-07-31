import type { SkillCheckPromptData } from '../../../dataModels/item/actions/ActionPromptsDataModel';

export default function prepareSkillCheckPrompts(
  prompts: [string, SkillCheckPromptData][]
): [string, SkillCheckPromptData][] {
  const counts: Record<string, number> = {};

  if (!prompts.length) return [];

  return prompts.map(([key, prompt]) => {
    prompt.skill ??= 'acr';

    if (!prompt.label) {
      const label = game.i18n.format('A5E.SkillCheck', {
        skill: game.i18n.localize(CONFIG.A5E.skills[prompt.skill])
      });

      counts[prompt.skill] ??= 0;
      counts[prompt.skill] += 1;

      // @ts-expect-error
      prompt.defaultLabel = `${label} #${counts[prompt.skill]}`;
    }

    return [key, prompt];
  });
}
