export default function prepareTraitGrantConfigObject() {
	return {
		alignment: {
			label: 'A5E.Alignment',
			config: Object.entries(CONFIG.A5E.alignments),
			propertyKey: 'system.traits.alignment',
		},
		conditionImmunities: {
			label: 'A5E.ConditionImmunities',
			config: Object.entries(CONFIG.A5E.conditions),
			propertyKey: 'system.traits.conditionImmunities',
		},
		creatureTypes: {
			label: 'A5E.CreatureTypesLabel',
			config: Object.entries(CONFIG.A5E.creatureTypes),
			propertyKey: 'system.details.creatureTypes',
		},
		damageImmunities: {
			label: 'A5E.DamageImmunities',
			config: Object.entries(CONFIG.A5E.damageTypes),
			propertyKey: 'system.traits.damageImmunities',
		},
		damageResistances: {
			label: 'A5E.DamageResistances',
			config: Object.entries(CONFIG.A5E.damageTypes),
			propertyKey: 'system.traits.damageResistances',
		},
		damageVulnerabilities: {
			label: 'A5E.DamageVulnerabilities',
			config: Object.entries(CONFIG.A5E.damageTypes),
			propertyKey: 'system.traits.damageVulnerabilities',
		},
		languages: {
			label: 'A5E.Languages',
			config: Object.entries(CONFIG.A5E.languages),
			propertyKey: 'system.proficiencies.languages',
		},
		size: {
			label: 'A5E.Size',
			config: Object.entries(CONFIG.A5E.actorSizes),
			propertyKey: 'system.traits.size',
		},
	};
}
