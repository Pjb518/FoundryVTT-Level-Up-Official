import { localize } from '#runtime/util/i18n';

export default function prepareCreatureTypes(data) {
	const types = data.system.details.creatureTypes.sort((a, b) =>
		a.toLowerCase().localeCompare(b.toLowerCase()),
	);

	const typeLabels = types.map((type) => localize(CONFIG.A5E.creatureTypes[type] ?? type));

	if (data.system.details.isSquad) {
		typeLabels.push(localize('Squad'));
	}

	if (data.system.details.isSwarm) {
		typeLabels.push(localize('A5E.details.creature.labels.swarm'));
	}

	return typeLabels;
}
