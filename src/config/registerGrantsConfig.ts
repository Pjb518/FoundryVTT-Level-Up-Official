export default function registerGrantsConfig(config: Record<string, any>) {
	const itemGrants = {
		ability: 'A5E.grants.headings.ability',
		attack: 'A5E.grants.headings.attack',
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
		skill: 'A5E.grants.headings.skill',
		skillSpecialty: 'A5E.grants.headings.skillSpecialty',
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
			config: Object.entries(config.abilities),
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
		lignment: {
			label: 'A5E.traits.headings.alignment',
			config: Object.entries(config.alignments),
			propertyKey: 'system.traits.alignment',
		},
		conditionImmunities: {
			label: 'A5E.conditions.immunities',
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

	return {
		itemGrants,
		proficiencyGrantConfigObject,
		traitGrantConfigObject,
	};
}
