export default function registerBonusesConfig() {
	const bonusTypes = {
		abilities: 'A5E.abilities.headings.ability',
		attacks: 'A5E.Attack',
		damage: 'A5E.damage.title',
		exertion: 'A5E.exertion.title',
		healing: 'A5E.healing.title',
		hitPoint: 'A5E.hitPoints.title',
		initiative: 'A5E.initiative.title',
		movement: 'A5E.details.movement.title',
		senses: 'A5E.senses.title',
		skills: 'A5E.skillLabels.title',
	};

	const bonusDialogKeys = {
		abilities: 'abilityBonus',
		attacks: 'attackBonus',
		damage: 'damageBonus',
		exertion: 'exertionBonus',
		healing: 'healingBonus',
		hitPoint: 'hitPointsBonus',
		initiative: 'initiativeBonus',
		movement: 'movementBonus',
		senses: 'sensesBonus',
		skills: 'skillBonus',
	};

	const bonusLabels = {
		abilities: {
			addButton: 'A5E.bonuses.labels.abilities.addButton',
			sectionHeader: 'A5E.bonuses.labels.abilities.sectionHeader',
			defaultName: 'A5E.bonuses.labels.abilities.defaultName',
			dialogName: 'A5E.bonuses.labels.abilities.dialogName',
		},
		attacks: {
			addButton: 'A5E.bonuses.labels.attack.addButton',
			sectionHeader: 'A5E.bonuses.labels.attack.sectionHeader',
			defaultName: 'A5E.bonuses.labels.attack.defaultName',
			dialogName: 'A5E.bonuses.labels.attack.dialogName',
		},
		damage: {
			addButton: 'A5E.bonuses.labels.damage.addButton',
			sectionHeader: 'A5E.bonuses.labels.damage.sectionHeader',
			defaultName: 'A5E.bonuses.labels.damage.defaultName',
			dialogName: 'A5E.bonuses.labels.damage.dialogName',
		},
		exertion: {
			addButton: 'A5E.bonuses.labels.exertion.addButton',
			sectionHeader: 'A5E.bonuses.labels.exertion.sectionHeader',
			defaultName: 'A5E.bonuses.labels.exertion.defaultName',
			dialogName: 'A5E.bonuses.labels.exertion.dialogName',
		},
		healing: {
			addButton: 'A5E.bonuses.labels.healing.addButton',
			sectionHeader: 'A5E.bonuses.labels.healing.sectionHeader',
			defaultName: 'A5E.bonuses.labels.healing.defaultName',
			dialogName: 'A5E.bonuses.labels.healing.dialogName',
		},
		hitPoint: {
			addButton: 'A5E.bonuses.labels.hitPoint.addButton',
			sectionHeader: 'A5E.bonuses.labels.hitPoint.sectionHeader',
			defaultName: 'A5E.bonuses.labels.hitPoint.defaultName',
			dialogName: 'A5E.bonuses.labels.hitPoint.dialogName',
		},
		initiative: {
			addButton: 'A5E.bonuses.labels.initiative.addButton',
			sectionHeader: 'A5E.bonuses.labels.initiative.sectionHeader',
			defaultName: 'A5E.bonuses.labels.initiative.defaultName',
			dialogName: 'A5E.bonuses.labels.initiative.dialogName',
		},
		movement: {
			addButton: 'A5E.bonuses.labels.movement.addButton',
			sectionHeader: 'A5E.bonuses.labels.movement.sectionHeader',
			defaultName: 'A5E.bonuses.labels.movement.defaultName',
			dialogName: 'A5E.bonuses.labels.movement.dialogName',
		},
		senses: {
			addButton: 'A5E.bonuses.labels.senses.addButton',
			sectionHeader: 'A5E.bonuses.labels.senses.sectionHeader',
			defaultName: 'A5E.bonuses.labels.senses.defaultName',
			dialogName: 'A5E.bonuses.labels.senses.dialogName',
		},
		skills: {
			addButton: 'A5E.bonuses.labels.skills.addButton',
			sectionHeader: 'A5E.bonuses.labels.skills.sectionHeader',
			defaultName: 'A5E.bonuses.labels.skills.defaultName',
			dialogName: 'A5E.bonuses.labels.skills.dialogName',
		},
	};

	return { bonusTypes, bonusLabels, bonusDialogKeys };
}
