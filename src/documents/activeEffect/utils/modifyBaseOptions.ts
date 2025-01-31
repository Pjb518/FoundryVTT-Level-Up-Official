import MODES from './effectModes';

// const [sampleValue, modes, effectOpts, componentType, phase] = specialOptions[key];
export default function modifyBaseOptions(options: Object) {
	// Setup options for boolean values
	options['system.attributes.inspiration'] = [
		false,
		MODES.OVERRIDE_ONLY,
		[
			[true, 'Has Inspiration'],
			[false, "Doesn't have Inspiration"],
		],
		'RADIO',
	];
	options['system.attributes.exertion.recoverOnRest'] = [
		false,
		MODES.OVERRIDE_ONLY,
		[
			[true, 'Can Recover'],
			[false, 'Cannot recover'],
		],
		'RADIO',
	];
	options['system.attributes.movement.traits.hover'] = [
		false,
		MODES.OVERRIDE_ONLY,
		[
			[true, 'Can Hover'],
			[false, 'Cannot Hover'],
		],
		'RADIO',
	];
	options['system.attributes.senses.blindsight.otherwiseBlind'] = [
		false,
		MODES.OVERRIDE_ONLY,
		[
			[true, 'Blind Beyond Vision'],
			[false, 'Normal Vision'],
		],
		'RADIO',
	];
	options['system.details.elite'] = [
		false,
		MODES.OVERRIDE_ONLY,
		[
			[true, 'Elite Monster'],
			[false, 'Normal Monster'],
		],
		'RADIO',
	];
	options['system.details.isSwarm'] = [
		false,
		MODES.OVERRIDE_ONLY,
		[
			[true, 'Is Swarm'],
			[false, 'Not a Swarm'],
		],
		'RADIO',
	];

	// Setup options for abilities and skills
	Object.keys(CONFIG.A5E.abilities).forEach((a) => {
		options[`system.abilities.${a}.save.proficient`] = [
			false,
			MODES.OVERRIDE_ONLY,
			[
				[true, 'Proficient'],
				[false, 'Not Proficient'],
			],
			'RADIO',
		];
	});

	Object.keys(CONFIG.A5E.skills).forEach((s) => {
		options[`system.skills.${s}.proficient`] = [
			0,
			MODES.OVERRIDE_ONLY,
			[
				[0, 'Not Proficient'],
				[1, 'Proficient'],
				[2, 'Expertise'],
			],
			'RADIO',
		];
		options[`system.skills.${s}.ability`] = [
			'',
			MODES.OVERRIDE_ONLY,
			[...Object.entries(CONFIG.A5E.abilities), ['@attributes.spellcasting', 'Spellcasting']],
			'RADIO',
		];
	});

	options['system.attributes.initiative.ability'] = [
		'',
		MODES.OVERRIDE_ONLY,
		Object.entries(CONFIG.A5E.abilities),
		'RADIO',
	];

	// Add options for details
	options['system.details.creatureTypes'] = [
		'',
		MODES.DEFAULT_MODES,
		Object.entries(CONFIG.A5E.creatureTypes),
		'TAG_GROUP',
	];

	// Add options for traits
	options['system.traits.alignment'] = [
		'',
		MODES.DEFAULT_STRING_MODES,
		Object.entries(CONFIG.A5E.alignments),
		'TAG_GROUP',
	];
	options['system.traits.conditionImmunities'] = [
		'',
		MODES.DEFAULT_STRING_MODES,
		Object.entries(CONFIG.A5E.conditions),
		'TAG_GROUP',
	];
	options['system.traits.damageImmunities'] = [
		'',
		MODES.DEFAULT_STRING_MODES,
		Object.entries(CONFIG.A5E.damageTypes),
		'TAG_GROUP',
	];
	options['system.traits.damageResistances'] = [
		'',
		MODES.DEFAULT_STRING_MODES,
		Object.entries(CONFIG.A5E.damageTypes),
		'TAG_GROUP',
	];
	options['system.traits.damageVulnerabilities'] = [
		'',
		MODES.DEFAULT_STRING_MODES,
		Object.entries(CONFIG.A5E.damageTypes),
		'TAG_GROUP',
	];
	options['system.traits.size'] = [
		'',
		MODES.OVERRIDE_ONLY,
		Object.entries(CONFIG.A5E.actorSizes),
		'RADIO',
	];

	// Add options for proficiencies
	options['system.proficiencies.armor'] = [
		'',
		MODES.DEFAULT_STRING_MODES,
		Object.entries(CONFIG.A5E.armor),
		'TAG_GROUP',
	];
	options['system.proficiencies.languages'] = [
		'',
		MODES.DEFAULT_STRING_MODES,
		Object.entries(CONFIG.A5E.languages),
		'TAG_GROUP',
	];
	// @ts-ignore
	options['system.proficiencies.tools'] = [
		'',
		MODES.DEFAULT_STRING_MODES,
		Object.values(CONFIG.A5E.tools).flatMap((c) => Object.entries(c)),
		'TAG_GROUP',
	];
	// @ts-ignore
	options['system.proficiencies.traditions'] = [
		'',
		MODES.DEFAULT_STRING_MODES,
		Object.values(CONFIG.A5E.maneuverTraditions),
		'TAG_GROUP',
	];
	// @ts-ignore
	options['system.proficiencies.weapons'] = [
		'',
		MODES.DEFAULT_STRING_MODES,
		Object.values(CONFIG.A5E.weapons).flatMap((c) => Object.entries(c)),
		'TAG_GROUP',
	];

	// Proficiency is prepared in base data so we add it here.
	options['system.attributes.prof'] = [0, MODES.DEFAULT_MODES];

	// Adds options for spell casting ability
	options['system.attributes.spellcasting'] = [
		'',
		MODES.OVERRIDE_ONLY,
		Object.entries(CONFIG.A5E.abilities),
		'RADIO',
	];

	// Bonuses
	options['flags.a5e.effects.bonuses.abilities'] = [{}, MODES.CUSTOM_ONLY, null, 'ABILITY_BONUS'];
	options['flags.a5e.effects.bonuses.attacks'] = [{}, MODES.CUSTOM_ONLY, null, 'ATTACK_BONUS'];
	options['flags.a5e.effects.bonuses.damage'] = [{}, MODES.CUSTOM_ONLY, null, 'DAMAGE_BONUS'];
	options['flags.a5e.effects.bonuses.healing'] = [{}, MODES.CUSTOM_ONLY, null, 'HEALING_BONUS'];
	options['flags.a5e.effects.bonuses.initiative'] = [
		{},
		MODES.CUSTOM_ONLY,
		null,
		'INITIATIVE_BONUS',
	];
	options['flags.a5e.effects.bonuses.skills'] = [{}, MODES.CUSTOM_ONLY, null, 'SKILL_BONUS'];

	// Removes these when data model is fixes
	delete options['system.bonuses.meleeWeaponAttack'];
	delete options['system.bonuses.rangedWeaponAttack'];
	delete options['system.bonuses.meleeSpellAttack'];
	delete options['system.bonuses.rangedSpellAttack'];
	delete options['system.attributes.initiative.bonus'];

	// Delete bonus associated values
	Object.keys(CONFIG.A5E.abilities).forEach((a) => {
		delete options[`system.abilities.${a}.check.mod`];
		delete options[`system.abilities.${a}.check.bonus`];
		delete options[`system.abilities.${a}.save.mod`];
		delete options[`system.abilities.${a}.save.bonus`];
	});

	Object.keys(CONFIG.A5E.skills).forEach((s) => {
		delete options[`system.skills.${s}.mod`];
		delete options[`system.skills.${s}.bonus`];
	});

	delete options['system.attributes.initiative.bonus'];

	delete options['system.attributes.ac.baseFormula'];
	delete options['system.attributes.ac.value'];

	delete options['system.classes.startingClass'];

	delete options['system.resources.classResources'];

	//delete options['system.spellBooks.*'];
	//delete options['system.spellResources.*.override'];

	delete options['system.grants'];

	// Delete deprecated options
	Object.keys(CONFIG.A5E.abilities).forEach((a) => {
		delete options[`system.abilities.${a}.check.bonus`];
		delete options[`system.abilities.${a}.save.bonus`];
	});

	Object.keys(CONFIG.A5E.skills).forEach((s) => {
		delete options[`system.skills.${s}.bonuses.check`];
		delete options[`system.skills.${s}.bonuses.passive`];
	});

	// Delete text details like bio, class, etc.
	delete options['system.details.age'];
	delete options['system.details.appearance'];
	delete options['system.details.archetype'];
	delete options['system.details.background'];
	delete options['system.details.bio']
	delete options['system.details.bonds'];
	delete options['system.details.classes'];
	delete options['system.details.culture'];
	delete options['system.details.destiny'];
	delete options['system.details.eyeColor'];
	delete options['system.details.flaws'];
	delete options['system.details.gender'];
	delete options['system.details.goals'];
	delete options['system.details.hairColor'];
	delete options['system.details.height'];
	delete options['system.details.heritage'];
	delete options['system.details.ideals'];
	delete options['system.details.isSquad'];
	delete options['system.details.level'];
	delete options['system.details.notes'];
	delete options['system.details.prestige'];
	delete options['system.details.skinColor'];
	delete options['system.details.terrain'];
	delete options['system.details.weight'];
	delete options['system.details.notes'];
	delete options['system.details.xp'];
	delete options['system.details.privateNotes'];
	delete options['system.source'];
	delete options['system.source.link'];
	delete options['system.source.name'];
	delete options['system.source.publisher'];

	// Delete Configuration options
	delete options['system.resources.primary.hideMax'];
	delete options['system.resources.secondary.hideMax'];
	delete options['system.resources.tertiary.hideMax'];
	delete options['system.resources.quaternary.hideMax'];

	// Delete movement and senses for derived data
	Object.keys(CONFIG.A5E.movement).forEach((m) => {
		delete options[`system.attributes.movement.${m}.distance`];
	});

	Object.keys(CONFIG.A5E.senses).forEach((s) => {
		delete options[`system.attributes.senses.${s}.distance`];
	});

	// Temporarily delete bonus fields
	delete options['system.bonuses.abilities'];
	delete options['system.bonuses.attacks'];
	delete options['system.bonuses.damage'];
	delete options['system.bonuses.healing'];
	delete options['system.bonuses.initiative'];
	delete options['system.bonuses.movement'];
	delete options['system.bonuses.senses'];
	delete options['system.bonuses.skills'];

	// Delete schema information
	delete options['system.schemaVersion.version'];
	delete options['system.schemaVersion.lastMigration'];

	// Delete migration data
	delete options['system.migrationData.lastMigration.schema'];
	delete options['system.migrationData.type'];
	delete options['system.migrationData.version'];

	// Delete spell books
	Object.keys(options).forEach(key => {
		if (key.startsWith('system.spellBooks.')) {
			delete options[key];
		}
	});

	// Delete spell resource overrides
	Object.keys(options).forEach(key => {
		if (key.startsWith('system.spellResources.') && key.endsWith('.override')) {
			delete options[key];
		}
	});
}
