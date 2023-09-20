import getAttunementLabel from './getAttunementLabel';
import getRarityLabel from './getRarityLabel';

export default function getObjectMechanicsLabel(item, options) {
  const attunement = getAttunementLabel(item);
  const { price } = item.system;
  const rarity = getRarityLabel(item);

  const includeAttunement = attunement && !options?.hideAttunementData;
  const includePrice = price && !options?.hidePrice;
  const includeRarity = rarity && !options?.hideRarity;

  if (includeRarity) {
    if (includePrice && includeAttunement) return `${rarity} (${attunement}; Cost ${price})`;
    if (includePrice) return `${rarity} (Cost ${price})`;
    if (includeAttunement) return `${rarity} (${attunement})`;

    return rarity;
  }

  if (includePrice && includeAttunement) return `${attunement}; Cost ${price}`;
  if (includePrice) return `Cost ${price}`;
  if (includeAttunement) return attunement;

  return null;
}
