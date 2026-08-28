export default function registerActionsConfig() {
	// =================================================
	//  Maps
	// =================================================
	const ROLL_SORT_KEY_MAP = {
		attack: 0,
		damage: 1,
		healing: 2,
		abilityCheck: 3,
		skillCheck: 4,
		savingThrow: 5,
		toolCheck: 6,
		generic: 7,
	} as const;

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

	const SPELL_CONSUME_OPTIONS = {
		artifactCharge: 'A5E.spells.spellcasting.artifactCharges',
		spellSlot: 'A5E.consumers.spellSlot',
		spellPoint: 'A5E.spells.spellcasting.points',
		// inventions: "A5E.spells.spellcasting.inventions",
		noConsume: 'A5E.consumers.nothing',
	} as const;

	const configurableConsumers = new Set(['actionUses', 'itemUses', 'hitDice', 'spell']);

	const resourceConsumerConfig = {
		classResource: { path: 'resources.classResources', label: 'Class Resource', type: 'value' },
		exertion: { path: 'attributes.exertion.current', label: 'A5E.exertion.title', type: 'value' },
		fatigue: { path: 'attributes.fatigue', label: 'A5E.conditions.fatigue', type: 'value' },
		favorPoints: {
			path: 'attributes.favorPoints.current',
			label: 'A5E.consumers.favorPoints',
			type: 'value',
		},
		hp: { path: 'attributes.hp.value', label: 'A5E.hitPoints.title', type: 'value' },
		inspiration: {
			path: 'attributes.inspiration',
			label: 'A5E.consumers.inspiration',
			type: 'boolean',
		},
		strife: { path: 'attributes.strife', label: 'A5E.conditions.strife.name', type: 'value' },
		supply: { path: 'supply', label: 'A5E.supply.title', type: 'value' },
		primaryResource: {
			path: 'resources.primary.value',
			label: 'A5E.consumers.resources.titlePluralPrimary',
			type: 'value',
		},
		secondaryResource: {
			path: 'resources.secondary.value',
			label: 'A5E.consumers.resources.titlePluralSecondary',
			type: 'value',
		},
		tertiaryResource: {
			path: 'resources.tertiary.value',
			label: 'A5E.consumers.resources.titlePluralTertiary',
			type: 'value',
		},
		quaternaryResource: {
			path: 'resources.quaternary.value',
			label: 'A5E.consumers.resources.titlePluralQuaternary',
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
		// Maps
		ROLL_SORT_KEY_MAP,

		// Constants
		ACTION_CONSUMER_TYPES,
		SPELL_CONSUMER_MODES,
		SPELL_CONSUME_OPTIONS,

		// Config
		configurableConsumers,
		resourceConsumerConfig,
		spellConsumerModes,
	};
}
