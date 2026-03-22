import { localize } from "#utils/localization/localize.ts";

export function getSkillCheckPromptTitle(prompt) {
  const { skills } = CONFIG.A5E;

  return localize("A5E.skillLabels.checks.skillSpecific", {
    skill: skills[prompt.skill],
  });
}
