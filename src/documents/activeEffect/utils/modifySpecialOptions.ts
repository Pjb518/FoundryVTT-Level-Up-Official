import MODES from './effectModes.ts';

// const [sampleValue, modes, effectOpts, componentType, phase] = specialOptions[key];
export default function modifySpecialOptions(options: object) {
	const ROLL_MODES = Object.entries(CONFIG.A5E.ROLL_MODE).map(([k, v]) => [
		v,
		k.toLowerCase().capitalize(),
	]);

	// Add Attack Options
	options['flags.a5e.effects.rollMode.attack.all'] = [0, MODES.DEFAULT_MODES, ROLL_MODES, 'RADIO'];
	options['flags.a5e.effects.grants.rollMode.attack.all'] = [
		0,
		MODES.OVERRIDE_ONLY,
		ROLL_MODES,
		'RADIO',
	];

	Object.keys(CONFIG.A5E.attackTypes).forEach((key) => {
		options[`system.rolls.${key}.incoming.rollMode`] = [
			0,
			MODES.DEFAULT_MODES,
			ROLL_MODES,
			'RADIO',
		];

		options[`system.rolls.${key}.outgoing.rollMode`] = [
			0,
			MODES.DEFAULT_MODES,
			ROLL_MODES,
			'RADIO',
		];

		options[`system.rolls.${key}.outgoing.expertiseDice`] = [0, MODES.DEFAULT_MODES];
		options[`system.rolls.${key}.outgoing.minRoll`] = [0, MODES.DEFAULT_MODES];
		options[`system.rolls.${key}.outgoing.maxRoll`] = [0, MODES.DEFAULT_MODES];
	});

	options['flags.a5e.effects.rollMode.abilityCheck.all'] = [
		0,
		MODES.OVERRIDE_ONLY,
		ROLL_MODES,
		'RADIO',
	];
	options['flags.a5e.effects.rollMode.abilitySave.all'] = [
		0,
		MODES.OVERRIDE_ONLY,
		ROLL_MODES,
		'RADIO',
	];
	options['flags.a5e.effects.rollMode.skillCheck.all'] = [
		0,
		MODES.OVERRIDE_ONLY,
		ROLL_MODES,
		'RADIO',
	];
	options['flags.a5e.effects.rollMode.concentration'] = [
		0,
		MODES.OVERRIDE_ONLY,
		ROLL_MODES,
		'RADIO',
	];
	options['system.rolls.death.rollMode'] = [0, MODES.DEFAULT_MODES, ROLL_MODES, 'RADIO'];
	options['system.rolls.death.expertiseDice'] = [0, MODES.DEFAULT_MODES, ROLL_MODES, 'RADIO'];
	options['system.rolls.death.minRoll'] = [0, MODES.DEFAULT_MODES, ROLL_MODES, 'RADIO'];
	options['system.rolls.death.maxRoll'] = [0, MODES.DEFAULT_MODES, ROLL_MODES, 'RADIO'];

	options['flags.a5e.effects.expertiseDice.all'] = [0, MODES.DEFAULT_MODES];
	options['flags.a5e.effects.expertiseDice.allChecks'] = [0, MODES.DEFAULT_MODES];
	options['flags.a5e.effects.expertiseDice.allSaves'] = [0, MODES.DEFAULT_MODES];

	// Add options for damage and conditions
	options['flags.a5e.effects.damageImmunities.all'] = [[], MODES.CUSTOM_ONLY, null, 'NONE'];
	options['flags.a5e.effects.damageResistances.all'] = [[], MODES.CUSTOM_ONLY, null, 'NONE'];
	options['flags.a5e.effects.damageVulnerabilities.all'] = [[], MODES.CUSTOM_ONLY, null, 'NONE'];
	options['flags.a5e.effects.conditionImmunities.all'] = [[], MODES.CUSTOM_ONLY, null, 'NONE'];

	const statusConditions = Object.entries(CONFIG.A5E.conditions);
	options['flags.a5e.effects.statusConditions'] = [
		[],
		MODES.CUSTOM_ONLY,
		statusConditions,
		'CHECKBOX',
	];

	// TODO: Maybe add something to automatically fail?
}
