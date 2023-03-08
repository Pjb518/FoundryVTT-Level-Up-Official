export default function prepareDamageResistances(data) {
  const damageResistances = data.system.traits.damageResistances.map((damageType) => (
    game.i18n.localize(CONFIG.A5E.damageTypes[damageType]) ?? damageType));

  damageResistances.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return damageResistances;
}
