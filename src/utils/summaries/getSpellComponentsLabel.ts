import type Item.OfType<'spell'> from '../../documents/item/spell';

export default function getSpellComponentsLabel(item: Item.OfType<'spell'>) {
	const components = Object.entries(item.system.components)
		.reduce((acc, [component, hasComponent]) => {
			if (hasComponent) acc.push(CONFIG.A5E.spellComponentAbbreviations[component]);

			return acc;
		}, [] as string[])
		.join(', ');

	if (typeof item?.system?.materials === 'string' && item?.system?.materials?.trim()) {
		return `${components} (${item?.system?.materials})`;
	}

	return components;
}
