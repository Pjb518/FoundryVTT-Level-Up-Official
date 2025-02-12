type ContextComponent = {
	heading: string;
	options?: any[];
	selectedProperty: string;
	component: string;
};

export default function getContextsMap(
	type: 'bonus' | 'grant',
	contextType: string,
): ContextComponent[] {
	const map: ContextComponent[] = [];

	if (contextType === 'abilities') {
		if (type === 'bonus') {
			map.push({
				heading: 'A5E.contexts.abilities',
				options: Object.entries(CONFIG.A5E.abilities),
				selectedProperty: 'context.abilities',
				component: 'TagGroup',
			});
		} else {
			map.push(
				{
					heading: 'Base Abilities',
					options: Object.entries(CONFIG.A5E.abilities),
					selectedProperty: 'abilities.base',
					component: 'TagGroup',
				},
				{
					heading: 'Ability Choices',
					options: Object.entries(CONFIG.A5E.abilities),
					selectedProperty: 'abilities.options',
					component: 'TagGroup',
				},
				{
					heading: 'Select Ability Bonus Automatically in Roll Prompt',
					selectedProperty: 'context.default',
					component: 'Checkbox',
				},
			);
		}

		map.push(
			{
				heading: 'Selectable Options Count',
				selectedProperty: 'abilities.total',
				component: 'Number',
			},
			{
				heading: 'A5E.contexts.bonusTypes',
				options: Object.entries(CONFIG.A5E.abilityBonusContexts),
				selectedProperty: 'context.types',
				component: 'TagGroup',
			},
			{
				heading: 'A5E.contexts.requiresProficiency',
				selectedProperty: 'context.requiresProficiency',
				component: 'Checkbox',
			},
		);
	}

	if (contextType === 'attacks') {
		if (type === 'bonus') {
			map.push({
				heading: 'A5E.contexts.attackType',
				options: Object.entries(CONFIG.A5E.attackTypes),
				selectedProperty: 'context.attackTypes',
				component: 'TagGroup',
			});
		} else {
			map.push(
				{
					heading: 'Base Attack Types',
					options: Object.entries(CONFIG.A5E.attackTypes),
					selectedProperty: 'attackTypes.base',
					component: 'TagGroup',
				},
				{
					heading: 'Attack Type Choices',
					options: Object.entries(CONFIG.A5E.attackTypes),
					selectedProperty: 'attackTypes.options',
					component: 'TagGroup',
				},
				{
					heading: 'Select Attack Bonus Automatically in Roll Prompt',
					selectedProperty: 'context.default',
					component: 'Checkbox',
				},
			);
		}

		map.push(
			{
				heading: 'Selectable Options Count',
				selectedProperty: 'attackTypes.total',
				component: 'Number',
			},
			{
				heading: 'A5E.contexts.spellLevel',
				options: Object.entries(CONFIG.A5E.spellLevels),
				selectedProperty: 'context.spellLevels',
				component: 'TagGroup',
			},
			{
				heading: 'A5E.contexts.requiresProficiency',
				selectedProperty: 'context.requiresProficiency',
				component: 'Checkbox',
			},
		);
	}

	if (contextType === 'damage') {
		map.push(
			{
				heading: 'A5E.contexts.attackType',
				options: Object.entries(CONFIG.A5E.damageBonusContexts),
				selectedProperty: 'context.attackTypes',
				component: 'TagGroup',
			},
			{
				heading: 'A5E.contexts.damageType',
				options: Object.entries(CONFIG.A5E.damageTypes),
				selectedProperty: 'context.damageTypes',
				component: 'TagGroup',
			},
			{
				heading: 'A5E.contexts.spellLevel',
				options: Object.entries(CONFIG.A5E.spellLevels),
				selectedProperty: 'context.spellLevels',
				component: 'TagGroup',
			},
			{
				heading: 'This bonus only applies to critical hits.',
				selectedProperty: 'context.isCritBonus',
				component: 'Checkbox',
			},
		);

		if (type === 'grant') {
			map.push({
				heading: 'Select Damage Bonus Automatically in Roll Prompt',
				selectedProperty: 'context.default',
				component: 'Checkbox',
			});
		}
	}

	if (contextType === 'healing') {
		map.push(
			{
				heading: 'A5E.contexts.healingType',
				options: Object.entries(CONFIG.A5E.healingBonusContexts),
				selectedProperty: 'context.healingTypes',
				component: 'TagGroup',
			},
			{
				heading: 'A5E.contexts.spellLevel',
				options: Object.entries(CONFIG.A5E.spellLevels),
				selectedProperty: 'context.spellLevels',
				component: 'TagGroup',
			},
		);

		if (type === 'grant') {
			map.push({
				heading: 'Select Healing Bonus Automatically in Roll Prompt',
				selectedProperty: 'context.default',
				component: 'Checkbox',
			});
		}
	}

	if (contextType === 'hitPoint') {
		map.push({
			heading: 'A5E.contexts.perLevel',
			selectedProperty: 'context.perLevel',
			component: 'Checkbox',
		});
	}

	if (contextType === 'initiative') {
		map.push(
			{
				heading: 'A5E.contexts.abilities',
				options: Object.entries(CONFIG.A5E.abilities),
				selectedProperty: 'context.abilities',
				component: 'TagGroup',
			},
			{
				heading: 'A5E.contexts.skills',
				options: Object.entries(CONFIG.A5E.skills),
				selectedProperty: 'context.skills',
				component: 'TagGroup',
			},
		);

		if (type === 'grant') {
			map.push({
				heading: 'Select Initiative Bonus Automatically in Roll Prompt',
				selectedProperty: 'context.default',
				component: 'Checkbox',
			});
		}
	}

	if (contextType === 'movement') {
		if (type === 'bonus') {
			map.push({
				heading: 'A5E.contexts.movementType',
				options: Object.entries(CONFIG.A5E.movementAbbreviations),
				selectedProperty: 'context.movementTypes',
				component: 'TagGroup',
			});
		} else {
			map.push(
				{
					heading: 'Base Movement Types',
					options: Object.entries(CONFIG.A5E.movementAbbreviations),
					selectedProperty: 'movementTypes.base',
					component: 'TagGroup',
				},
				{
					heading: 'Movement Type Choices',
					options: Object.entries(CONFIG.A5E.movementAbbreviations),
					selectedProperty: 'movementTypes.options',
					component: 'TagGroup',
				},
			);
		}

		map.push(
			{
				heading: 'Selectable Options Count',
				selectedProperty: 'movementTypes.total',
				component: 'Number',
			},
			// {
			//   heading: 'Value If Original Is Zero',
			//   selectedProperty: 'context.valueIfOriginalIsZero',
			//   component: 'String'
			// },
			{
				heading: 'Is Hover For Flying Speed',
				selectedProperty: 'context.isHover',
				component: 'Checkbox',
			},
		);
	}

	if (contextType === 'senses') {
		if (type === 'bonus') {
			map.push({
				heading: 'A5E.contexts.senses',
				options: Object.entries(CONFIG.A5E.senses),
				selectedProperty: 'context.senses',
				component: 'TagGroup',
			});
		} else {
			map.push(
				{
					heading: 'Base Senses',
					options: Object.entries(CONFIG.A5E.senses),
					selectedProperty: 'senses.base',
					component: 'TagGroup',
				},
				{
					heading: 'Senses Type Choices',
					options: Object.entries(CONFIG.A5E.senses),
					selectedProperty: 'senses.options',
					component: 'TagGroup',
				},
			);
		}

		map.push(
			{
				heading: 'Selectable Options Count',
				selectedProperty: 'senses.total',
				component: 'Number',
			},
			// {
			//   heading: 'Value If Original Is Zero',
			//   selectedProperty: 'context.valueIfOriginalIsZero',
			//   component: 'String'
			// },
			{
				heading: 'Is Blind Beyond Vision Range',
				selectedProperty: 'context.otherwiseBlind',
				component: 'Checkbox',
			},
		);
	}

	if (contextType === 'skills') {
		if (type === 'bonus') {
			map.push({
				heading: 'A5E.contexts.skills',
				options: Object.entries(CONFIG.A5E.skills),
				selectedProperty: 'context.skills',
				component: 'TagGroup',
			});
		} else {
			map.push(
				{
					heading: 'Base Skills',
					options: Object.entries(CONFIG.A5E.skills),
					selectedProperty: 'skills.base',
					component: 'TagGroup',
				},
				{
					heading: 'Skill Choices',
					options: Object.entries(CONFIG.A5E.skills),
					selectedProperty: 'skills.options',
					component: 'TagGroup',
				},
				{
					heading: 'Select Skill Bonus Automatically in Roll Prompt',
					selectedProperty: 'context.default',
					component: 'Checkbox',
				},
			);
		}

		map.push(
			{
				heading: 'Selectable Options Count',
				selectedProperty: 'skills.total',
				component: 'Number',
			},
			{
				heading: 'A5E.contexts.requiresProficiency',
				selectedProperty: 'context.requiresProficiency',
				component: 'Checkbox',
			},
			{
				heading: 'A5E.contexts.passiveOnly',
				selectedProperty: 'context.passiveOnly',
				component: 'Checkbox',
			},
		);
	}

	return map;
}
