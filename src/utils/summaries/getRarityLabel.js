export default function getRarityLabel(item) {
  const { unidentified, rarity } = item?.system ?? {};

  if (!game.user.isGM && unidentified) return null;
  if (!rarity || rarity === 'mundane') return null;

  return CONFIG.A5E.itemRarity[rarity] ?? rarity;
}
