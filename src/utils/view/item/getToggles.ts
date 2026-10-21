export function getToggles(item: any): Toggle[] {
	let toggles = [] as Toggle[];

	if (item.isType('object')) toggles = getObjectToggles(item);

	return toggles.sort((a, b) => a.label.localeCompare(b.label));
}

function getObjectToggles(item: Item.OfType<'object'>) {
	const toggles = [] as Toggle[];

	if (item.system.requiresAttunement) {
		toggles.push({ label: 'Attuned', property: 'attuned' });
	}

	toggles.push({ label: 'UnIdentified', property: 'unidentified' });

	return toggles;
}

type Toggle = {
	label: string;
	property: string;
};
