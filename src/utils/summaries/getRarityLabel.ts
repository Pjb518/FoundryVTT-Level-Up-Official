export default function getRarityLabel(item: Item.OfType<'object'>): string {
	const { unidentified, rarity } = item.system ?? {};

	if (!game.user?.isGM && unidentified) return '';
	if (!rarity || rarity === 'mundane') return '';

	return CONFIG.A5E.itemRarity[rarity] ?? (rarity as string);
}
