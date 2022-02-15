export default function prepareDamageVulnerabilities(data) {
  const damageVulnerabilities = data.data.traits.damageVulnerabilities.map((damageType) => (
    game.i18n.localize(CONFIG.A5E.damageTypes[damageType]) ?? damageType));

  damageVulnerabilities.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return damageVulnerabilities;
}
