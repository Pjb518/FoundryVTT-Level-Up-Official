// eslint-disable-next-line import/no-unresolved
import { localize } from "#utils/localization/localize.ts";

export default function getSkillCheckPromptTitle(prompt) {
  const { skills } = CONFIG.A5E;

  return localize("A5E.SkillCheckPrompt", {
    skill: skills[prompt.skill],
  });
}
