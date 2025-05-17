import { localize } from "#utils/localization/localize.ts";

export function prepareAbilityOptions(
  includeNullValue = false,
  includeNoneValue = false,
) {
  const abilities = Object.entries(CONFIG.A5E.abilityAbbreviations).map(
    ([key, value]) => [key, localize(value as string)],
  );

  if (includeNullValue) abilities.unshift([null, localize("A5E.None")]);
  if (includeNoneValue) abilities.unshift(["none", localize("A5E.None")]);

  return abilities;
}
