import type ObjectItemA5e from '../../documents/item/object.ts';

import { localize } from "#utils/localization/localize.ts";

export default function getArmorMods(item: ObjectItemA5e) {
	const { armorMods } = CONFIG.A5E;

	return item.system.armorMods.map(
		(property: string) => localize(armorMods[property]) ?? property,
	) as string[];
}
