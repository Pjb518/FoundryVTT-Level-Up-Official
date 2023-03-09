export default function prepareAbilityOptions(includeNullValue = false, includeNoneValue = false) {
  const abilities = Object.entries(CONFIG.A5E.abilityAbbreviations).map(
    ([key, value]) => [key, game.i18n.localize(value)]
  );

  if (includeNullValue) {
    abilities.unshift([null, game.i18n.localize('A5E.None')]);
  }

  if (includeNoneValue) {
    abilities.unshift(['none', game.i18n.localize('A5E.None')]);
  }

  return abilities;
}
