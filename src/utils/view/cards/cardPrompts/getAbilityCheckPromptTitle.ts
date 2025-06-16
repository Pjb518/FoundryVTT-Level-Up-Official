import { localize } from "#utils/localization/localize.ts";

export function getAbilityCheckPromptTitle(prompt) {
  const { abilities } = CONFIG.A5E;

  return localize("A5E.abilities.headings.checkSpecific", {
    ability: abilities[prompt.ability],
  });
}
