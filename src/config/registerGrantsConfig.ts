export default function registerGrantsConfig(config: Record<string, any>) {
	const itemGrants = {
		ability: 'A5E.grants.headings.ability',
		attack: 'A5E.grants.headings.attack',
		currency: 'A5E.grants.headings.currency',
		damage: 'A5E.grants.headings.damage',
		exertion: 'A5E.grants.headings.exertion',
		expertiseDice: 'A5E.grants.headings.expertiseDice',
		feature: 'A5E.grants.headings.feature',
		healing: 'A5E.grants.headings.healing',
		hitPoint: 'A5E.grants.headings.hitPoint',
		item: 'A5E.grants.headings.item',
		initiative: 'A5E.grants.headings.initiative',
		movement: 'A5E.grants.headings.movement',
		proficiency: 'A5E.grants.headings.proficiency',
		rollOverride: 'A5E.grants.headings.rollOverride',
		senses: 'A5E.grants.headings.senses',
		settings: 'A5E.grants.headings.settings',
		skill: 'A5E.grants.headings.skill',
		skillSpecialty: 'A5E.grants.headings.skillSpecialty',
		spell: 'A5E.grants.headings.spell',
		trait: 'A5E.grants.headings.trait',
	};

	const proficiencyGrantConfigObject = {
		armor: {
			label: 'A5E.armorClass.headings.armorPlural',
			config: Object.entries(config.armor),
			propertyKey: 'system.proficiencies.armor',
		},
		tradition: {
			label: 'A5E.maneuvers.headings.traditionPlural',
			config: Object.entries(config.maneuverTraditions),
			propertyKey: 'system.proficiencies.traditions',
		},
		skill: {
			label: 'A5E.skillLabels.titlePlural',
			config: Object.entries(config.skills),
			propertyKey: '',
		},
		savingThrow: {
			label: 'A5E.rollLabels.savingThrows.titlePlural',
			config: [
				...Object.entries(config.abilities),
				['concentration', 'Concentration'],
				['death', 'Death'],
			],
			propertyKey: '',
		},
		tool: {
			label: 'A5E.tools.titlePlural',
			config: config.tools,
			propertyKey: 'system.proficiencies.tools',
		},
		weapon: {
			label: 'A5E.weapons.titlePlural',
			config: config.weapons,
			propertyKey: 'system.proficiencies.weapons',
		},
	};

	const traitGrantConfigObject = {
		alignment: {
			label: 'A5E.traits.headings.alignment',
			config: Object.entries(config.alignments),
			propertyKey: 'system.traits.alignment',
		},
		conditionImmunities: {
			label: 'A5E.traits.headings.conditions.immunities',
			config: Object.entries(config.conditions),
			propertyKey: 'system.traits.conditionImmunities',
		},
		creatureTypes: {
			label: 'A5E.details.creature.labels.types',
			config: Object.entries(config.creatureTypes),
			propertyKey: 'system.details.creatureTypes',
		},
		damageImmunities: {
			label: 'A5E.traits.headings.damage.immunities',
			config: Object.entries(config.damageTypes),
			propertyKey: 'system.traits.damageImmunities',
		},
		damageResistances: {
			label: 'A5E.traits.headings.damage.resistances',
			config: Object.entries(config.damageTypes),
			propertyKey: 'system.traits.damageResistances',
		},
		damageVulnerabilities: {
			label: 'A5E.traits.headings.damage.vulnerabilities',
			config: Object.entries(config.damageTypes),
			propertyKey: 'system.traits.damageVulnerabilities',
		},
		languages: {
			label: 'A5E.details.languages',
			config: Object.entries(config.languages),
			propertyKey: 'system.proficiencies.languages',
		},
		size: {
			label: 'A5E.traits.size.title',
			config: Object.entries(config.actorSizes),
			propertyKey: 'system.traits.size',
		},
	};

	const settingsGrantConfig = {
		carryCapacityAbility: {
			type: 'radio',
			label: 'Carry Capacity Ability',
			config: config.abilities,
			default: 'str',
		},
		criticalHitThresholdSpell: { type: 'number', label: 'Spell Crit Hit Threshold', default: 20 },
		criticalHitThresholdWeapon: { type: 'number', label: 'Weapon Crit Hit Threshold', default: 20 },
		deathSaveThreshold: { type: 'number', label: 'Death Save Threshold', default: 10 },
		doubleCarryCapacity: { type: 'boolean', label: 'Double Carry Capacity', default: false },
		halflingLuck: { type: 'boolean', label: 'Enable Halfling Luck', default: false },
		jackOfAllTrades: { type: 'boolean', label: 'Enable Jack of All Trades', default: false },
		restoreSpellPointsOnShortRest: {
			type: 'boolean',
			label: 'Restore Spell Points on Short Rest',
			default: true,
		},
		restoreSpellSlotsOnShortRest: {
			type: 'boolean',
			label: 'Restore Spell Slots on Short Rest',
			default: false,
		},
	};

	return {
		itemGrants,
		proficiencyGrantConfigObject,
		traitGrantConfigObject,
		settingsGrantConfig,
	};
}
