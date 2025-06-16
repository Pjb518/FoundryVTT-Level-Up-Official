import { localize } from "#utils/localization/localize.ts";

export function getSkillCheckPromptTitle(prompt) {
  const { skills } = CONFIG.A5E;

  return localize("A5E.SkillCheckPrompt", {
    skill: skills[prompt.skill],
  });
}
