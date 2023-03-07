export default function getArmorProficiencies(includeNullValue = false) {
  const abilities = Object.entries(CONFIG.A5E.abilityAbbreviations).map(
    ([key, value]) => [key, game.i18n.localize(value)]
  );

  if (includeNullValue) {
    abilities.unshift([null, game.i18n.localize('A5E.None')]);
  }

  return abilities;
}
