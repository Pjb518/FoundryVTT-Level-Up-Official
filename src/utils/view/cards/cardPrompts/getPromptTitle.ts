import { localize } from "#utils/localization/localize.ts";

import { getAbilityCheckPromptTitle } from "./getAbilityCheckPromptTitle.ts";
import { getEffectPromptTitle } from "./getEffectPromptTitle.ts";
import { getSavingThrowPromptTitle } from "./getSavingThrowPromptTitle.ts";
import { getSkillCheckPromptTitle } from "./getSkillCheckPromptTitle.ts";

export function getPromptTitle(prompt, actorId) {
  switch (prompt.type) {
    case "abilityCheck":
      return getAbilityCheckPromptTitle(prompt);
    case "effect":
      return getEffectPromptTitle(prompt);
    case "savingThrow":
      return getSavingThrowPromptTitle(prompt, actorId);
    case "skillCheck":
      return getSkillCheckPromptTitle(prompt);
    default:
      return prompt?.label || localize("A5E.Other");
  }
}
