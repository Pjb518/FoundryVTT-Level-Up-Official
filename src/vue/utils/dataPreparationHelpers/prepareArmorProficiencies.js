export default function getArmorProficiencies(data) {
  const armorProficiencies = data.data.proficiencies.armor.map((armor) => (
    game.i18n.localize(armor === 'shield' ? 'A5E.ArmorShieldPlural' : CONFIG.A5E.armor[armor])));

  armorProficiencies.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return armorProficiencies;
}
