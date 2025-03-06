// ---------------------------------------------------
// Filter Data
/**
 * Data for filters on the spells page. Schools of magic are added in on the page.
 */
export default function registerFilterConfig(A5E) {
	const abilityActionFilters = {};

	Object.entries(A5E.abilityActivationTypes).forEach(([value, label]) => {
		abilityActionFilters[value] = {
			label,
			key: 'system.activation.type',
			type: 'action',
			truthValue: 'or',
		};
	});

	A5E.filters = {
		features: {
			activationCost: {
				label: 'A5E.filterLabels.activationCost',
				filters: { ...abilityActionFilters },
			},
		},
		maneuvers: {
			activationCost: {
				label: 'A5E.filterLabels.activationCost',
				filters: { ...abilityActionFilters },
			},
			traditions: {
				label: 'A5E.filterLabels.manueverTraditions',
				filters: {},
			},
			miscellaneous: {
				label: 'A5E.filterLabels.miscellaneous',
				filters: {
					concentration: {
						label: 'A5E.conditions.concentration',
						key: 'system.concentration',
						type: 'boolean',
					},
					stance: {
						label: 'Stance',
						key: 'system.isStance',
						type: 'boolean',
					},
				},
			},
		},
		objects: {
			activationCost: {
				label: 'A5E.filterLabels.activationCost',
				filters: { ...abilityActionFilters },
			},
			rarity: {
				label: 'A5E.filterLabels.rarity',
				filters: {},
			},
			miscellaneous: {
				label: 'A5E.filterLabels.miscellaneous',
				filters: {
					attuned: { label: 'A5E.attument.headings.attuned', key: 'system.attuned', type: 'boolean' },
					bulky: { label: 'A5E.objects.bulky', key: 'system.bulky', type: 'boolean' },
					2: { label: 'A5E.equippedState.equipped', key: 'system.equippedState', type: 'value' }, // For Equipped State
					plotItem: { label: 'A5E.objects.plotItem', key: 'system.plotItem', type: 'boolean' },
					requiresAttunement: {
						label: 'A5E.attument.headings.required',
						key: 'system.requiredAttunement',
						type: 'boolean',
					},
				},
			},
		},
		spells: {
			activationCost: {
				label: 'A5E.filterLabels.activationCost',
				filters: { ...abilityActionFilters },
			},
			components: {
				label: 'A5E.filterLabels.spellComponents',
				filters: {
					material: {
						label: 'A5E.spells.components.material',
						key: 'system.components.material',
						type: 'boolean',
					},
					seen: {
						label: 'A5E.spells.components.seen',
						key: 'system.components.seen',
						type: 'boolean',
					},
					vocalized: {
						label: 'A5E.spells.components.vocalized',
						key: 'system.components.vocalized',
						type: 'boolean',
					},
				},
			},
			miscellaneous: {
				label: 'A5E.filterLabels.miscellaneous',
				filters: {
					concentration: {
						label: 'A5E.conditions.concentration',
						key: 'system.concentration',
						type: 'boolean',
					},
					ritual: {
						label: 'A5E.spells.ritual',
						key: 'system.ritual',
						type: 'boolean',
					},
					prepared: {
						label: 'A5E.spells.prepared',
						key: 'system.prepared',
						type: 'boolean',
					},
				},
			},
			primarySpellSchools: {
				label: 'A5E.filterLabels.primarySpellSchools',
				filters: {},
			},
		},
	};

	Object.entries(A5E.maneuverTraditions).forEach(([value, label]) => {
		A5E.filters.maneuvers.traditions.filters[value] = {
			label,
			key: 'system.tradition',
			type: 'value',
			truthValue: 'or',
		};
	});

	Object.entries(A5E.itemRarity).forEach(([value, label]) => {
		A5E.filters.objects.rarity.filters[value] = {
			label,
			key: 'system.rarity',
			type: 'value',
		};
	});

	Object.entries(A5E.spellSchools.primary).forEach(([value, label]) => {
		A5E.filters.spells.primarySpellSchools.filters[value] = {
			label,
			key: 'system.schools.primary',
			type: 'value',
			truthValue: 'or',
		};
	});
}
