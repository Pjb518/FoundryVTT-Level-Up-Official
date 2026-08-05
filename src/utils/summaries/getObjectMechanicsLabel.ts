import type ObjectItemA5e from '../../documents/item/object.ts';

import getAttunementLabel from './getAttunementLabel.ts';
import getRarityLabel from './getRarityLabel.ts';

export default function getObjectMechanicsLabel(item: ObjectItemA5e, options: Record<string, any>) {
	const attunement = getAttunementLabel(item);
	const { value, denomination, special } = item.system.price;
	const rarity = getRarityLabel(item);

	const includeAttunement = attunement && !options?.hideAttunementData;
	const includePrice = (value || special.length) && !options?.hidePrice;
	const includeRarity = rarity && !options?.hideRarity;

	const price = value ? `${value} ${denomination}` : `${special}`;

	if (includeRarity) {
		if (includePrice && includeAttunement) return `${rarity} (${attunement}; Cost ${price})`;
		if (includePrice) return `${rarity} (Cost ${price})`;
		if (includeAttunement) return `${rarity} (${attunement})`;

		return rarity;
	}

	if (includePrice && includeAttunement) return `${attunement}; Cost ${price}`;
	if (includePrice) return `Cost ${price}`;
	if (includeAttunement) return attunement;

	return '';
}
