export default function getCraftingComponentsLabel(item: Item.OfType<'object'>) {
	return item.system.craftingComponents ?? '';
}
