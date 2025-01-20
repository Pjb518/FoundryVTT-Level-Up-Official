import { get } from 'svelte/store';
import { localize } from '#runtime/util/i18n';

import ActorSheetTempSettingsStore from '../stores/ActorSheetTempSettingsStore';

function getItemName(itemType, subType) {
	if (itemType === 'feature') {
		return localize(CONFIG.A5E.featureTypes[subType]);
	}

	if (itemType === 'object') {
		return localize(CONFIG.A5E.objectTypes[subType]);
	}

	if (itemType === 'spell') {
		const spellLevel = parseInt(subType, 10);
		return localize(spellLevel === 0 ? CONFIG.A5E.spellLevels[0] : 'A5E.Spell');
	}

	return localize(CONFIG.A5E.itemTypes[itemType]);
}

function createFeature(type) {
	return {
		featureType: type,
	};
}

function createInteraction(type) {
	return {
		interactionType: type,
	};
}

function createManuever(type) {
	const system = {
		degree: Number(type),
	};

	// Add Exertion Consumer
	const actions = {
		[foundry.utils.randomID()]: {
			name: 'Execute',
			consumers: {
				[foundry.utils.randomID()]: {
					resource: 'exertion',
					quantity: 1,
					type: 'resource',
				},
			},
		},
	};

	system.actions = actions;
	return system;
}

function createObject(type) {
	return {
		objectType: type,
	};
}

function createSpell(type, options = {}) {
	const { actor } = options;

	const spellBookId =
		get(ActorSheetTempSettingsStore)?.[actor.uuid]?.currentSpellBook ||
		actor.spellBooks?.first()?._id;

	const system = {
		level: Number(type),
		spellBook: spellBookId,
	};

	if (system.level === 0) return system;

	// Add Spell Consumer
	const actions = {
		[foundry.utils.randomID()]: {
			name: 'Cast Spell',
			consumers: {
				[foundry.utils.randomID()]: {
					mode: 'variable',
					spellLevel: Number(type),
					points: CONFIG.A5E.spellLevelCost[Number(type)],
					type: 'spell',
				},
			},
		},
	};

	system.actions = actions;
	return system;
}

const itemMappings = {
	feature: createFeature,
	interaction: createInteraction,
	maneuver: createManuever,
	object: createObject,
	spell: createSpell,
};

export default async function createItem(actor, itemType, subType) {
	const updateData = {
		name: localize('A5E.NewItem', { type: localize(getItemName(itemType, subType)) }),
		type: itemType,
		system: itemMappings[itemType](subType, { actor }),
	};

	const documents = await actor.createEmbeddedDocuments('Item', [updateData]);
	documents.forEach((d) => d?.sheet?.render(true));
}
