import { localize } from '#utils/localization/localize.ts';

export default function getArmorMods(item: Item.OfType<'object'>) {
	const { armorMods } = CONFIG.A5E;

	return item.system.armorMods.map(
		(property: string) => localize(armorMods[property]) ?? property,
	) as string[];
}
