export default function prepareProficiencyConfigObject() {
	return {
		armor: {
			label: 'A5E.armorClass.headings.armorPlural',
			config: Object.entries(CONFIG.A5E.armor),
			propertyKey: 'system.proficiencies.armor',
		},
		tradition: {
			label: 'A5E.maneuvers.headings.traditionPlural',
			config: Object.entries(CONFIG.A5E.maneuverTraditions),
			propertyKey: 'system.proficiencies.traditions',
		},
		skill: {
			label: 'A5E.skillLabels.titlePlural',
			config: Object.entries(CONFIG.A5E.skills),
			propertyKey: '',
		},
		savingThrow: {
			label: 'A5E.rollLabels.savingThrows.titlePlural',
			config: Object.entries(CONFIG.A5E.abilities),
			propertyKey: '',
		},
		tool: {
			label: 'A5E.tools.titlePlural',
			config: CONFIG.A5E.tools,
			propertyKey: 'system.proficiencies.tools',
		},
		weapon: {
			label: 'A5E.Weapons',
			config: CONFIG.A5E.weapons,
			propertyKey: 'system.proficiencies.weapons',
		},
	};
}
