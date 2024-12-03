import type ObjectItemA5e from '../../documents/item/object';

export default function getCraftingComponentsLabel(item: ObjectItemA5e) {
	return item.system.craftingComponents ?? '';
}
