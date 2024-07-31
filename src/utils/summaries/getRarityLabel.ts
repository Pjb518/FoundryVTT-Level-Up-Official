import type ObjectItemA5e from '../../documents/item/object';

export default function getRarityLabel(item: ObjectItemA5e): string {
  const { unidentified, rarity } = item.system ?? {};

  if (!game.user?.isGM && unidentified) return '';
  if (!rarity || rarity === 'mundane') return '';

  return CONFIG.A5E.itemRarity[rarity] ?? rarity as string;
}
