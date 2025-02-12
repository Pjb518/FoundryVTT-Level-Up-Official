export default function prepareProficiencyConfigObject() {
	return {
		armor: {
			label: 'A5E.ArmorPlural',
			config: Object.entries(CONFIG.A5E.armor),
			propertyKey: 'system.proficiencies.armor',
		},
		tradition: {
			label: 'A5E.ManeuverTraditionPlural',
			config: Object.entries(CONFIG.A5E.maneuverTraditions),
			propertyKey: 'system.proficiencies.traditions',
		},
		skill: {
			label: 'A5E.SkillPlural',
			config: Object.entries(CONFIG.A5E.skills),
			propertyKey: '',
		},
		savingThrow: {
			label: 'A5E.SavingThrowPlural',
			config: Object.entries(CONFIG.A5E.abilities),
			propertyKey: '',
		},
		tool: {
			label: 'A5E.ToolPlural',
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
