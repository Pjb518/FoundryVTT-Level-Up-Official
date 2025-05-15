import type ObjectItemA5e from '../../documents/item/object';

import { localize } from '#runtime/util/i18n';

export default function getMaterialPropertiesSummary(item: ObjectItemA5e) {
	const { flaws, materialProperties, modPorts } = CONFIG.A5E;

	return item.system.materialProperties.map((property) => {
		if (property === 'flaw') {
			const flawTypes = item.system.flaws
				?.map((flaw) => localize(flaws[flaw]) ?? null)
				?.filter(Boolean)
				?.sort((a, b) => a.localeCompare(b));

			if (!flawTypes.length) return materialProperties.flaw;

			return localize('A5E.objects.properties.flawSpecific', { type: flawTypes.join(', ') });
		}

		if (property === 'spacefaring') {
			if (item.system.modPorts) {
				if (item.system.modPorts !== '1') {
					const modPort = modPorts[item.system.modPorts];
					return localize('A5E.objects.properties.spacefaringSpecificPlural', { type: modPort });
				}

				const modPort = modPorts[item.system.modPorts];
				return localize('A5E.objects.properties.spacefaringSpecific', { type: modPort });
			}

			return localize('A5E.objects.properties.spacefaring');
		}

		return materialProperties[property] ?? property;
	}) as string[];
}
