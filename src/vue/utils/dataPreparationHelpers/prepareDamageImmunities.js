export default function prepareDamageImmunities(data) {
  const damageImmunities = data.data.traits.damageImmunities.map((damageType) => (
    game.i18n.localize(CONFIG.A5E.damageTypes[damageType]) ?? damageType));

  damageImmunities.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return damageImmunities;
}
