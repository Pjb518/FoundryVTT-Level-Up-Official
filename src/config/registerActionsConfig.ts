export default function registerActionsConfig() {
	// =================================================
	//  Consumers
	// =================================================

	// =================================================
	//  Consumers
	// =================================================
	const ACTION_CONSUMER_TYPES = [
		'actionUses',
		'ammunition',
		'hitDice',
		'itemUses',
		'quantity',
		'resource',
		'spell',
	] as const;

	const SPELL_CONSUMER_MODES = [
		'variable',
		'chargesOnly',
		'inventionsOnly',
		'slotsOnly',
		'pointsOnly',
	] as const;

	const configurableConsumers = new Set(['actionUses', 'itemUses', 'hitDice', 'spell']);

	const resourceConsumerConfig = {
		classResource: { path: 'resources.classResources', label: 'Class Resource', type: 'value' },
		exertion: { path: 'attributes.exertion.current', label: 'A5E.exertion.title', type: 'value' },
		favorPoints: {
			path: 'attributes.favorPoints.current',
			label: 'A5E.consumers.favorPoints',
			type: 'value',
		},
		hp: { path: 'attributes.hp.value', label: 'A5E.hitPoints.title', type: 'value' },
		inspiration: { path: 'attributes.inspiration', label: 'A5E.consumers.inspiration', type: 'boolean' },
		primaryResource: {
			path: 'resources.primary.value',
			label: 'A5E.consumers.resources.primary',
			type: 'value',
		},
		secondaryResource: {
			path: 'resources.secondary.value',
			label: 'A5E.consumers.resources.secondary',
			type: 'value',
		},
		tertiaryResource: {
			path: 'resources.tertiary.value',
			label: 'A5E.consumers.resources.tertiary',
			type: 'value',
		},
		quaternaryResource: {
			path: 'resources.quaternary.value',
			label: 'A5E.consumers.resources.quaternary',
			type: 'value',
		},
	};

	const spellConsumerModes = {
		variable: 'A5E.consumers.modes.variable',
		chargesOnly: 'A5E.consumers.modes.chargesOnly',
		inventionsOnly: 'A5E.consumers.modes.inventionsOnly',
		pointsOnly: 'A5E.consumers.modes.pointsOnly',
		slotsOnly: 'A5E.consumers.modes.slotsOnly',
	};

	return {
		// Constants
		ACTION_CONSUMER_TYPES,
		SPELL_CONSUMER_MODES,

		// Config
		configurableConsumers,
		resourceConsumerConfig,
		spellConsumerModes,
	};
}
