export default function getRarityLabel(item) {
  if (!game.user.isGM && item.system.unidentified) return null;
  if (!item.system.rarity) return null;

  return CONFIG.A5E.itemRarity[item.system.rarity] ?? item.system.rarity;
}
