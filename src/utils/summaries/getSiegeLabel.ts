import { localize } from '#utils/localization/localize.ts';

export default function getSiegeLabel(item: Item.OfType<'object'>) {
	const { siege, weaponProperties } = item.system;
	if (!siege || !weaponProperties?.includes('siege')) return '';

	const size = localize(CONFIG.A5E.actorSizes[siege.size as 'lg'] ?? siege.size);
	return `${size}, ${localize('A5E.weapons.siege.ac')} ${siege.ac}, ${localize('A5E.weapons.siege.hp')} ${siege.hp}`;
}
