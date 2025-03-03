import registerActionsConfig from './config/registerActionsConfig';
import registerActiveEffectConfig from './config/registerActiveEffectConfig';
import registerBonusesConfig from './config/registerBonusesConfig';
import registerCharacterClassesConfig from './config/registerCharacterClassesConfig';
import registerClassesConfig from './config/registerClassesConfig';
import registerContextsConfig from './config/registerContextsConfig';
import registerDocumentConfig from './config/registerDocumentConfig';
import registerEncounterElements from './config/registerEncounterElements';
import registerEffectGroupConfig from './config/registerEffectGroupConfig';
import registerEffectLocalizationConfig from './config/registerEffectLocalizationConfig';
import registerFilterConfig from './config/registerFilterConfig';
import registerGrantsConfig from './config/registerGrantsConfig';
import registerModuleIncompatibilities from './config/registerModuleIncompatibilities';
import PRELOCALIZED_KEYS from './config/registerPreLocalizationProperties';
import registerPremiumContentConfig from './config/registerPremiumContentConfig';
import registerPublisherConfig from './config/registerPublisherConfig';
import registerReducerConfig from './config/registerReducerConfig';
import registerSettingsConfig from './config/registerSettingsConfig';

/* ------------------------------------------------- */
/*                    Constants                      */
/* ------------------------------------------------- */

const ARMOR_MODES = {
	ADD: 1,
	OVERRIDE: 2,
};

/**
 * XP required to achieve each character level.
 */
const CHARACTER_EXP_LEVELS = [
	0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000,
	195000, 225000, 265000, 305000, 355000,
] as const;

/**
 * XP granted for each challenge rating.
 * @enum {number}
 */
const CR_EXP_LEVELS = {
	0: 10,
	'1/8': 25,
	'1/4': 50,
	'1/2': 100,
	1: 200,
	2: 450,
	3: 700,
	4: 1100,
	5: 1800,
	6: 2300,
	7: 2900,
	8: 3900,
	9: 5000,
	10: 5900,
	11: 7200,
	12: 8400,
	13: 10000,
	14: 11500,
	15: 13000,
	16: 15000,
	17: 18000,
	18: 20000,
	19: 22000,
	20: 25000,
	21: 33000,
	22: 41000,
	23: 50000,
	24: 62000,
	25: 75000,
	26: 90000,
	27: 105000,
	28: 120000,
	29: 135000,
	30: 155000,
};

/**
 * Condition states for shields.
 */
const DAMAGED_STATES = {
	INTACT: 0,
	DAMAGED: 1,
	BROKEN: 2,
};

/**
 * Supported dice roll modes
 */
const DICE_ROLL_MODES = {
	blindroll: 'A5E.diceRollModes.blind',
	gmroll: 'A5E.diceRollModes.gm',
	publicroll: 'A5E.diceRollModes.public',
	selfroll: 'A5E.diceRollModes.self',
};

/**
 * Enum for object equipped state
 */
const EQUIPPED_STATES = {
	NOT_CARRIED: 0,
	CARRIED: 1,
	EQUIPPED: 2,
};

/**
 * Enum for object prepared state
 */
const PREPARED_STATES = {
	UNPREPARED: 0,
	PREPARED: 1,
	ALWAYS_PREPARED: 2,
};

/**
 * Enum for supported d20 roll modes.
 */
const ROLL_MODE = {
	NORMAL: 0,
	ADVANTAGE: 1,
	DISADVANTAGE: -1,
};

/* ------------------------------------------------- */
/*                    Config
/* ------------------------------------------------- */

/**
 * The set of ability scores used within the system.
 * @enum {string}
 */
const abilities = {
	str: 'A5E.abilities.strength',
	dex: 'A5E.abilities.dexterity',
	con: 'A5E.abilities.constitution',
	int: 'A5E.abilities.intelligence',
	wis: 'A5E.abilities.wisdom',
	cha: 'A5E.abilities.charisma',
};

/**
 * Localized abbreviations for ability scores.
 * @enum {string}
 */
const abilityAbbreviations = {
	str: 'A5E.abilities.abbreviations.strength',
	dex: 'A5E.abilities.abbreviations.dexterity',
	con: 'A5E.abilities.abbreviations.constitution',
	int: 'A5E.abilities.abbreviations.intelligence',
	wis: 'A5E.abilities.abbreviations.wisdom',
	cha: 'A5E.abilities.abbreviations.charisma',
};

/**
 * Localized abbreviations for activation costs.
 * @enum {string}
 */
const abilityActivationTypes = {
	action: 'A5E.actions.headings.activation.action',
	bonusAction: 'A5E.actions.headings.activation.bonusAction',
	day: 'A5E.durations.day',
	hour: 'A5E.durations.hour',
	lairAction: 'A5E.actions.headings.activation.lairAction',
	legendaryAction: 'A5E.actions.headings.activation.legendaryAction',
	minute: 'A5E.durations.minute',
	none: 'A5E.None',
	objectInteraction: 'A5E.actions.headings.activation.objectInteraction',
	reaction: 'A5E.actions.headings.activation.reaction',
	special: 'A5E.actions.headings.activation.special',
};

/**
 * Localized abbreviations for plural activation costs.
 * @enum {string}
 */
const abilityActivationTypesPlural = {
	action: 'A5E.actions.headings.activation.actionPlural',
	bonusAction: 'A5E.actions.headings.activation.bonusActionPlural',
	day: 'A5E.durations.dayPlural',
	hour: 'A5E.durations.hourPlural',
	lairAction: 'A5E.actions.headings.activation.lairActionPlural',
	legendaryAction: 'A5E.actions.headings.activation.legendaryActionPlural',
	minute: 'A5E.durations.minutePlural',
	none: 'A5E.None',
	objectInteraction: 'A5E.actions.headings.activation.objectInteractionPlural',
	reaction: 'A5E.actions.headings.activation.reaction',
	special: 'A5E.actions.headings.activation.special',
};

const actionOptions = {
	abilityCheck: 'A5E.actions.headings.options.abilityCheck',
	attack: 'A5E.actions.headings.options.attack',
	damage: 'A5E.actions.headings.options.damage',
	healing: 'A5E.actions.headings.options.healing',
	savingThrow: 'A5E.actions.headings.options.savingThrow',
};

/**
 * The set of possible creature sizes in the system.
 * @enum {string}
 */
const actorSizes = {
	tiny: 'A5E.SizeTiny',
	sm: 'A5E.SizeSmall',
	med: 'A5E.SizeMedium',
	lg: 'A5E.SizeLarge',
	huge: 'A5E.SizeHuge',
	grg: 'A5E.SizeGargantuan',
	titan: 'A5E.SizeTitanic',
};

const originItemTypes = [
	'archetype',
	'background',
	'class',
	'culture',
	'destiny',
	'heritage',
] as const;

const alignments = {
	chaotic: 'Chaotic',
	evil: 'Evil',
	good: 'Good',
	lawful: 'Lawful',
	neutral: 'Neutral',
};

const ammunitionProperties = {
	explosive: 'A5E.ammunition.properties.explosive',
	flaming: 'A5E.ammunition.properties.flaming',
	punching: 'A5E.ammunition.properties.punching',
};

const appliedArmorTypes = {
	armor: 'A5E.armorClass.appliedArmorTypes.armor',
	underarmor: 'A5E.armorClass.appliedArmorTypes.underarmor',
};

const areaIcons = {
	circle: '<i class="fa-regular fa-circle"></i>',
	cone: '<i class="fa-solid fa-wifi"></i>',
	cube: '<i class="fa-solid fa-cube"></i>',
	cylinder: '<i class="fa-solid fa-circle"></i>',
	emanation: '<i class="fa-regular fa-circle-dot"></i>',
	line: '<i class="fa-solid fa-grip-lines"></i>',
	sphere: '<i class="fa-solid fa-meteor"></i>',
	square: '<i class="fa-regular fa-square-full"></i>',
	wall: '<i class="fa-solid fa-road-spikes"></i>',
};

const areaTypes = {
	circle: 'A5E.area.circle',
	cone: 'A5E.area.cone',
	cube: 'A5E.area.cube',
	cylinder: 'A5E.area.cylinder',
	emanation: 'A5E.area.emanation',
	line: 'A5E.area.line',
	sphere: 'A5E.area.sphere',
	square: 'A5E.area.square',
	wall: 'A5E.area.wall',
};

/**
 * Maps the area types to template shapes
 */
const areaTemplates = {
	circle: 'circle',
	cone: 'cone',
	cube: 'rect',
	cylinder: 'circle',
	line: 'ray',
	sphere: 'circle',
	square: 'rect',
};

/**
 * The set of core armor types in the system.
 * @enum {string}
 */
const armor = {
	light: 'A5E.armorClass.types.light',
	medium: 'A5E.armorClass.types.medium',
	heavy: 'A5E.armorClass.types.heavy',
	shield: 'A5E.armorClass.types.shield',
};

const armorModes = {
	1: 'A5E.armorClass.modes.add',
	2: 'A5E.armorClass.modes.override',
};

const armorMods = {
	biosensors: 'A5E.armorClass.mods.biosensors',
	dronePort: 'A5E.armorClass.mods.dronePort',
	environmentalRecycling: 'A5E.armorClass.mods.environmentalRecycling',
	floodlights: 'A5E.armorClass.mods.floodlights',
	gliderWings: 'A5E.armorClass.mods.gliderWings',
	grapplingHook: 'A5E.armorClass.mods.grapplingHook',
	groundAnchors: 'A5E.armorClass.mods.groundAnchors',
	hazmatSealing: 'A5E.armorClass.mods.hazmatSealing',
	improvedColdShielding: 'A5E.armorClass.mods.improvedColdShielding',
	improvedHeatShielding: 'A5E.armorClass.mods.improvedHeatShielding',
	improvedWeaponHatch: 'A5E.armorClass.mods.improvedWeaponHatch',
	integratedFirstAid: 'A5E.armorClass.mods.integratedFirstAid',
	integratedJetpack: 'A5E.armorClass.mods.integratedJetpack',
	integratedTool: 'A5E.armorClass.mods.integratedTool',
	kineticAssistance: 'A5E.armorClass.mods.kineticAssistance',
	massJammer: 'A5E.armorClass.mods.massJammer',
	mindshielding: 'A5E.armorClass.mods.mindshielding',
	nightvisionGoggles: 'A5E.armorClass.mods.nightvisionGoggles',
	personalJammer: 'A5E.armorClass.mods.personalJammer',
	pocket: 'A5E.armorClass.mods.pocket',
	powerClaw: 'A5E.armorClass.mods.powerClaw',
	rechargePort: 'A5E.armorClass.mods.rechargePort',
	reconApparatus: 'A5E.armorClass.mods.reconApparatus',
	repairKit: 'A5E.armorClass.mods.repairKit',
	secondaryArmorPlating: 'A5E.armorClass.mods.secondaryArmorPlating',
	weaponHatch: 'A5E.armorClass.mods.weaponHatch',
};

/**
 * The set of core armor properties in the system.
 * @enum {string}
 */
const armorProperties = {
	camouflaged: 'A5E.armorClass.properties.camouflaged',
	cloaking: 'A5E.armorClass.properties.cloaking',
	coldShielding: 'A5E.armorClass.properties.coldShielding',
	greased: 'A5E.armorClass.properties.greased',
	heatShielding: 'A5E.armorClass.properties.heatShielding',
	mirrored: 'A5E.armorClass.properties.mirrored',
	shearThickening: 'A5E.armorClass.properties.shearThickening',
	spiked: 'A5E.armorClass.properties.spiked',
	stealthy: 'A5E.objects.properties.stealthy',
	storage: 'A5E.objects.properties.storage',
};

/**
 * The set of core armor types in the system in plural form.
 * @enum {string}
 */
const armorPlural = {
	light: 'A5E.armorClass.types.light',
	medium: 'A5E.armorClass.types.medium',
	heavy: 'A5E.armorClass.types.heavy',
	shield: 'A5E.armorClass.types.shieldPlural',
};

const attackTypes = {
	meleeWeaponAttack: 'A5E.attacks.types.meleeWeapon',
	rangedWeaponAttack: 'A5E.attacks.types.rangedWeapon',
	meleeSpellAttack: 'A5E.attacks.types.meleeSpell',
	rangedSpellAttack: 'A5E.attacks.types.rangedSpell',
};

const carryCapacityMultiplier = {
	tiny: 0.5,
	sm: 1,
	med: 1,
	lg: 2,
	huge: 4,
	grg: 8,
	titan: 16,
};

const capacityTypes = {
	bulk: 'A5E.capacity.type.bulk',
	count: 'A5E.capacity.type.count',
	weight: 'A5E.capacity.type.weight',
};

/**
 *
 */
const chatCardTypes = [
	'abilityCheck',
	'hitDice',
	'item',
	'rollTableOutput',
	'savingThrow',
	'skillCheck',
] as const;

/**
 * The set of core conditions in the system.
 * @enum {string}
 */
const conditions = {
	blinded: 'A5E.conditions.blinded',
	bloodied: 'A5E.conditions.bloodied',
	charmed: 'A5E.conditions.charmed',
	concentration: 'A5E.conditions.concentration',
	confused: 'A5E.conditions.confused',
	corruption: 'A5E.conditions.corruption',
	dazzled: 'A5E.conditions.dazzled',
	deafened: 'A5E.conditions.deafened',
	doomed: 'A5E.conditions.doomed',
	encumbered: 'A5E.conditions.encumbered',
	enervated: 'A5E.conditions.enervated',
	fatigue: 'A5E.conditions.fatigue',
	fixated: 'A5E.conditions.fixated',
	frightened: 'A5E.conditions.frightened',
	grappled: 'A5E.conditions.grappled',
	hungover: 'A5E.conditions.hungover',
	incapacitated: 'A5E.conditions.incapacitated',
	inebriated: 'A5E.conditions.inebriated',
	invisible: 'A5E.conditions.invisible',
	paralyzed: 'A5E.conditions.paralyzed',
	petrified: 'A5E.conditions.petrified',
	poisoned: 'A5E.conditions.poisoned',
	prone: 'A5E.conditions.prone',
	rattled: 'A5E.conditions.rattled',
	restrained: 'A5E.conditions.restrained',
	slowed: 'A5E.conditions.slowed',
	strife: 'A5E.conditions.strife',
	stunned: 'A5E.conditions.stunned',
	unconscious: 'A5E.conditions.unconscious',
};

/**
 * The default creature types.
 * @enum {string}
 */
const creatureTypes = {
	aberration: 'A5E.details.creature.types.aberration',
	beast: 'A5E.details.creature.types.beast',
	celestial: 'A5E.details.creature.types.celestial',
	construct: 'A5E.details.creature.types.construct',
	dragon: 'A5E.details.creature.types.dragon',
	elemental: 'A5E.details.creature.types.elemental',
	fey: 'A5E.details.creature.types.fey',
	fiend: 'A5E.details.creature.types.fiend',
	giant: 'A5E.details.creature.types.giant',
	humanoid: 'A5E.details.creature.types.humanoid',
	monstrosity: 'A5E.details.creature.types.monstrosity',
	ooze: 'A5E.details.creature.types.ooze',
	plant: 'A5E.details.creature.types.plant',
	undead: 'A5E.details.creature.types.undead',
};

const damagedStates = {
	0: 'A5E.damagedState.intact',
	1: 'A5E.damagedState.damaged',
	2: 'A5E.damagedState.broken',
};

const baseScalingModes = {
	cantrip: 'A5E.scaling.modes.cantrip',
	spellLevel: 'A5E.scaling.modes.spellLevel',
	spellPoints: 'A5E.scaling.modes.spellPoints',
	artifactCharges: 'A5E.scaling.modes.artifactCharges',
	actionUses: 'A5E.scaling.modes.actionUses',
	itemUses: 'A5E.scaling.modes.itemUses',
};

const targetScalingModes = {
	cantrip: 'A5E.scaling.modes.cantrip',
	spellLevel: 'A5E.scaling.modes.spellLevel',
	spellPoints: 'A5E.scaling.modes.spellPoints',
	artifactCharges: 'A5E.scaling.modes.artifactCharges',
	actionUses: 'A5E.scaling.modes.actionUses',
	itemUses: 'A5E.scaling.modes.itemUses',
};

/**
 * The set of core damage types in the system.
 * @enum {string}
 */
const damageTypes = {
	acid: 'A5E.damageTypes.acid',
	bludgeoning: 'A5E.damageTypes.bludgeoning',
	cold: 'A5E.damageTypes.cold',
	fire: 'A5E.damageTypes.fire',
	force: 'A5E.damageTypes.force',
	lightning: 'A5E.damageTypes.lightning',
	necrotic: 'A5E.damageTypes.necrotic',
	piercing: 'A5E.damageTypes.piercing',
	poison: 'A5E.damageTypes.poison',
	psychic: 'A5E.damageTypes.psychic',
	radiant: 'A5E.damageTypes.radiant',
	slashing: 'A5E.damageTypes.slashing',
	thunder: 'A5E.damageTypes.thunder',
};

const damageColors = {
	acid: '#a9b920',
	bludgeoning: '#b9a137',
	cold: '#99d9d9',
	fire: '#f18131',
	force: '#6f599a',
	lightning: '#f9d130',
	necrotic: '#7a7e88',
	piercing: '#c13129',
	poison: '#a140a1',
	psychic: '#f95889',
	radiant: '#dfa6df',
	slashing: '#b8b8d0',
	thunder: '#e2c269',
};

const defaultActorImportCompendia = {
	inventory: 'a5e.a5e-adventuring-gear',
	maneuvers: 'a5e.a5e-maneuvers',
	spells: 'a5e.a5e-spells',
};

const equippedStates = {
	0: 'A5E.equippedState.notCarried',
	1: 'A5E.equippedState.carried',
	2: 'A5E.equippedState.equipped',
};

const expertiseDiceSidesMap = {
	0: 0,
	1: 4,
	2: 6,
	3: 8,
	4: 10,
	5: 12,
	6: 20,
};

const featureTypes = {
	background: 'A5E.features.types.background',
	boon: 'A5E.features.types.boon',
	class: 'A5E.features.types.class',
	culture: 'A5E.features.types.culture',
	destiny: 'A5E.features.types.destiny',
	feat: 'A5E.features.types.feat',
	heritage: 'A5E.features.types.heritage',
	knack: 'A5E.features.types.knack',
	legendaryAction: 'A5E.features.types.legendaryAction',
	naturalWeapon: 'A5E.features.types.naturalWeapon',
	other: 'A5E.features.types.other',
};

/**
 * The set of core healing types in the system.
 * @enum {string}
 */
const healingTypes = {
	healing: 'A5E.healing.title',
	temporaryHealing: 'A5E.healing.temporary',
};

const healingColors = {
	healing: '#eeee9b',
	temporaryHealing: '#2fa6b1',
};

/**
 * List of various item rarities.
 * @enum {string}
 */
const itemRarity = {
	mundane: 'A5E.itemRarities.mundane',
	common: 'A5E.itemRarities.common',
	uncommon: 'A5E.itemRarities.uncommon',
	rare: 'A5E.itemRarities.rare',
	veryRare: 'A5E.itemRarities.veryRare',
	legendary: 'A5E.itemRarities.legendary',
	artifact: 'A5E.itemRarities.artifact',
};

const itemTechLevels = {
	archaic: 'A5E.itemTechLevels.archaic',
	standard: 'A5E.itemTechLevels.standard',
	advanced: 'A5E.itemTechLevels.advanced',
};

/**
 * // List of various item types.
 * @enum {string}
 */
const itemTypes = {
	background: 'TYPES.Item.background',
	culture: 'TYPES.Item.culture',
	destiny: 'TYPES.Item.destiny',
	feature: 'TYPES.Item.feature',
	maneuver: 'TYPES.Item.maneuver',
	object: 'TYPES.Item.object',
	spell: 'TYPES.Item.spell',
};

/**
 * List of Inventory Filters
 * @enum {string}
 */
const inventoryFilters = {
	bulk: 'Bulk',
};

const knackTypes = {
	adept: 'Practiced Technique',
	artificer: 'Field Discovery',
	artificerrevised: 'Field Discovery',
	bard: 'Adventuring Trick',
	berserker: 'Developed Talent',
	bloodblade: 'Esoteric Arts',
	cleric: 'Sign of Faith',
	druid: 'Secret of Nature',
	elementalist: 'Elemental Adaptation',
	fighter: 'Soldiering Knack',
	herald: 'Divine Lesson',
	marshal: 'Lesson of War',
	psion: 'Cognitive Discoveries',
	psyknight: 'Psychic Isometrics',
	ranger: 'Exploration Knack',
	rogue: 'Skill Trick',
	savant: 'Clever Scheme',
	scholar: 'Scholarly Discovery',
	scientist: 'Scientific Praxes',
	scout: 'Clever Trick',
	sorcerer: 'Arcane Innovation',
  trooper: 'Drill',
	warlock: 'Secret of Arcana',
	wielder: 'Artifact Whisper',
	witch: 'Magical Mystery',
	wizard: 'Elective Study',
};

/**
 * Languages a character can learn.
 * @enum {string}
 */
const languages = {
	abyssal: 'A5E.languages.abyssal',
	aquan: 'A5E.languages.aquan',
	auran: 'A5E.languages.auran',
	boggard: 'A5E.languages.boggard',
	celestial: 'A5E.languages.celestial',
	common: 'A5E.languages.common',
	deep: 'A5E.languages.deepSpeech',
	draconic: 'A5E.languages.draconic',
	druidic: 'A5E.languages.druidic',
	dwarvish: 'A5E.languages.dwarvish',
	elvish: 'A5E.languages.elvish',
	giant: 'A5E.languages.giant',
	gnoll: 'A5E.languages.gnoll',
	gnomish: 'A5E.languages.gnomish',
	goblin: 'A5E.languages.goblin',
	grimlock: 'A5E.languages.grimlock',
	grippli: 'A5E.languages.grippli',
	halfling: 'A5E.languages.halfling',
	ignan: 'A5E.languages.ignan',
	infernal: 'A5E.languages.infernal',
	machine: 'A5E.languages.machine',
	minotaur: 'A5E.languages.minotaur',
	mycelial: 'A5E.languages.mycelial',
	orc: 'A5E.languages.orc',
	primordial: 'A5E.languages.primordial',
	sylvan: 'A5E.languages.sylvan',
	terran: 'A5E.languages.terran',
	cant: 'A5E.languages.thievesCant',
	undercommon: 'A5E.languages.undercommon',
};

const maneuverDegrees = {
	0: 'A5E.maneuvers.degrees.basic',
	1: 'A5E.maneuvers.degrees.1',
	2: 'A5E.maneuvers.degrees.2',
	3: 'A5E.maneuvers.degrees.3',
	4: 'A5E.maneuvers.degrees.4',
	5: 'A5E.maneuvers.degrees.5',
};

/**
 * Combat Traditions a character can learn.
 * @enum {string}
 */
const maneuverTraditions = {
	aceStarfighter: 'A5E.maneuvers.traditions.aceStarfighter',
	adamantMountain: 'A5E.maneuvers.traditions.adamantMountain',
	arcaneArtillery: 'A5E.maneuvers.traditions.arcaneArtillery',
	arcaneKnight: 'A5E.maneuvers.traditions.arcaneKnight',
	awakenedMind: 'A5E.maneuvers.traditions.awakenedMind',
	beastUnity: 'A5E.maneuvers.traditions.beastUnity',
	bitingZephyr: 'A5E.maneuvers.traditions.bitingZephyr',
	blazingStarglaive: 'A5E.maneuvers.traditions.blazingStarglaive',
	comedicJabs: 'A5E.maneuvers.traditions.comedicJabs',
	cuttingOmen: 'A5E.maneuvers.traditions.cuttingOmen',
	eldritchBlackguard: 'A5E.maneuvers.traditions.eldritchBlackguard',
	gallantHeart: 'A5E.maneuvers.traditions.gallantHeart',
	grindingCog: 'A5E.maneuvers.traditions.grindingCog',
	mindfulBody: 'A5E.maneuvers.traditions.mindfulBody',
	mirrorsGlint: 'A5E.maneuvers.traditions.mirrorsGlint',
	mistAndShade: 'A5E.maneuvers.traditions.mistAndShade',
	rapidCurrent: 'A5E.maneuvers.traditions.rapidCurrent',
	razorsEdge: 'A5E.maneuvers.traditions.razorsEdge',
	sanctifiedSteel: 'A5E.maneuvers.traditions.sanctifiedSteel',
	sanguineKnot: 'A5E.maneuvers.traditions.sanguineKnot',
	selflessSentinel: 'A5E.maneuvers.traditions.selflessSentinel',
	spiritedSteed: 'A5E.maneuvers.traditions.spiritedSteed',
	temperedIron: 'A5E.maneuvers.traditions.temperedIron',
	toothAndClaw: 'A5E.maneuvers.traditions.toothAndClaw',
	unendingWheel: 'A5E.maneuvers.traditions.unendingWheel',
	viciousVein: 'A5E.maneuvers.traditions.viciousVein',
	vipersFangs: 'A5E.maneuvers.traditions.vipersFangs',
};

const materialProperties = {
	comfortable: 'A5E.objects.properties.comfortable',
	feybane: 'A5E.objects.properties.feybane',
	flaw: 'A5E.objects.properties.flaw',
	fortified: 'A5E.objects.properties.fortified',
	hackable: 'A5E.objects.properties.hackable',
	hardy: 'A5E.objects.properties.hardy',
	highQuality: 'A5E.objects.properties.highQuality',
	lightweight: 'A5E.objects.properties.lightweight',
	lowMaintenance: 'A5E.objects.properties.lowMaintenance',
	rust: 'A5E.objects.properties.rust',
	silvered: 'A5E.objects.properties.silvered',
	spacefaring: 'A5E.objects.properties.spacefaring',
	strength: 'A5E.objects.properties.strength',
	underarmor: 'A5E.objects.properties.underarmor',
	weighty: 'A5E.objects.properties.weighty',
	wild: 'A5E.objects.properties.wild',
};

const flaws = {
	bludgeoning: 'A5E.damageTypes.bludgeoning',
	piercing: 'A5E.damageTypes.piercing',
	slashing: 'A5E.damageTypes.slashing',
};

const modPorts = {
	0: 'Ignore',
	1: '1',
	2: '2',
	3: '3',
	4: '4',
	5: '5',
	6: '6',
	7: '7',
	8: '8'
};

/**
 * The set of core movement types in the system.
 * @enum {string}
 */
const movement = {
	walk: 'A5E.details.movement.types.walk',
	burrow: 'A5E.details.movement.types.burrow',
	climb: 'A5E.details.movement.types.climb',
	fly: 'A5E.details.movement.types.fly',
	swim: 'A5E.details.movement.types.swim',
};

/**
 * The set of core movement types in the system.
 * @enum {string}
 */
const movementAbbreviations = {
	walk: 'A5E.details.movement.typesAbbr.walk',
	burrow: 'A5E.details.movement.typesAbbr.burrow',
	climb: 'A5E.details.movement.typesAbbr.climb',
	fly: 'A5E.details.movement.typesAbbr.fly',
	swim: 'A5E.details.movement.typesAbbr.swim',
};

/**
 * @enum {string}
 */
const distanceUnits = {
	feet: 'A5E.distances.full.feet',
	miles: 'A5E.distances.full.miles',
	meters: 'A5E.distances.full.meters',
	kilometers: 'A5E.distances.full.kilometers',
};

const distanceAbbreviations = {
	feet: 'A5E.distances.abbr.feet',
	miles: 'A5E.distances.abbr.miles',
	meters: 'A5E.distances.abbr.meters',
	kilometers: 'A5E.distances.abbr.kilometers',
};

const visionUnits = {
	...distanceUnits,
	unlimited: 'A5E.RangeUnlimited',
};

/**
 * The set of object subtypes available within the system.
 * @enum {string}
 */
const objectTypes = {
	armor: 'A5E.objects.types.singular.armor',
	ammunition: 'A5E.objects.types.singular.ammunition',
	clothing: 'A5E.objects.types.singular.clothing',
	consumable: 'A5E.objects.types.singular.consumable',
	container: 'A5E.objects.types.singular.container',
	helm: 'A5E.objects.types.singular.helm',
	jewelry: 'A5E.objects.types.singular.jewelry',
	miscellaneous: 'A5E.objects.types.singular.miscellaneous',
	shield: 'A5E.objects.types.singular.shield',
	tool: 'A5E.objects.types.singular.tool',
	weapon: 'A5E.objects.types.singular.weapon',
};

/**
 * The set of object subtypes available within the system.
 * @enum {string}
 */
const objectTypesPlural = {
	armor: 'A5E.objects.types.plural.armor',
	ammunition: 'A5E.objects.types.singular.ammunition',
	clothing: 'A5E.objects.types.singular.clothing',
	consumable: 'A5E.objects.types.plural.consumable',
	container: 'A5E.objects.types.plural.container',
	helm: 'A5E.objects.types.plural.helm',
	jewelry: 'A5E.objects.types.singular.jewelry',
	miscellaneous: 'A5E.objects.types.singular.miscellaneous',
	shield: 'A5E.objects.types.plural.shield',
	tool: 'A5E.objects.types.plural.tool',
	weapon: 'A5E.objects.types.plural.weapon',
};

const preparedStates = {
	0: 'A5E.preparedState.unprepared',
	1: 'A5E.preparedState.prepared',
	2: 'A5E.preparedState.alwaysPrepared',
};

const psionicDisciplines = {
	dynakinetic: 'A5E.psionicDisciplines.disciplines.dynakinetic',
	kinesthetic: 'A5E.psionicDisciplines.disciplines.kinesthetic',
	telekinetic: 'A5E.psionicDisciplines.disciplines.telekinetic',
	telepathic: 'A5E.psionicDisciplines.disciplines.telepathic',
};

/**
 * The set of core range types in the system.
 * @enum {string}
 */
const rangeDescriptors = {
	self: 'A5E.RangeSelf',
	touch: 'A5E.RangeTouch',
	fiveFeet: 'A5E.RangeFiveFeet',
	short: 'A5E.RangeShort',
	medium: 'A5E.RangeMedium',
	long: 'A5E.RangeLong',
	other: 'A5E.RangeOther',
};

const rangeValues = {
	self: 'A5E.RangeSelf',
	touch: 'A5E.RangeTouch',
	fiveFeet: 5,
	short: 30,
	medium: 60,
	long: 120,
};

/**
 * The set of core armor properties in the system.
 * @enum {string}
 */
const repairTools = {
	forge: 'A5E.repairTools.forge',
	engineersToolbox: 'A5E.repairTools.engineersToolbox',
	notRepairable: 'A5E.repairTools.notRepairable',
	sewingKit: 'A5E.repairTools.sewingKit',
	smithsTools: 'A5E.repairTools.smithsTools',
	tinkersTools: 'A5E.repairTools.tinkersTools',
};

const resourceRecoveryOptions = {
	shortRest: 'A5E.RestShort',
	longRest: 'A5E.RestLong',
	recharge: 'A5E.actions.headings.recharge.title',
	round: 'A5E.durations.round',
	turn: 'A5E.durations.turn',
	minute: 'A5E.durations.minute',
	hour: 'A5E.durations.hour',
	day: 'A5E.durations.day',
	week: 'A5E.durations.week',
	month: 'A5E.durations.month',
	year: 'A5E.durations.year',
};

const rollModes = {
	normal: 'A5E.RollModeNormal',
	advantage: 'A5E.RollModeAdvantage',
	disadvantage: 'A5E.RollModeDisadvantage',
};

// TODO: Localization - Add localizations for these roll types.
const rollTypes = {
	abilityCheck: 'Ability Check',
	attack: 'Attack',
	damage: 'Damage',
	healing: 'Healing',
	generic: 'Generic',
	savingThrow: 'Saving Throw',
	skillCheck: 'Skill Check',
	toolCheck: 'ToolCheck',
};

const saveDCOptions = {
	spellcasting: 'A5E.SpellDC',
	maneuver: 'A5E.ManeuverDC',
	...abilities,
	custom: 'A5E.Custom',
};

/**
 * The set of core special sense types in the system.
 * @enum {string}
 */
const senses = {
	blindsight: 'A5E.SenseBlindsight',
	darkvision: 'A5E.SenseDarkvision',
	tremorsense: 'A5E.SenseTremorsense',
	truesight: 'A5E.SenseTruesight',
};

const scrollData = {
	0: {
		attackBonus: 5,
		cost: '10 gp',
		craftingComponent: 'Magical inks',
		saveDC: 13,
		rarity: 'common',
	},
	1: {
		attackBonus: 5,
		cost: '25 gp',
		craftingComponent: 'Magical inks',
		saveDC: 13,
		rarity: 'common',
	},
	2: {
		attackBonus: 5,
		cost: '75 gp',
		craftingComponent: 'Magical inks',
		saveDC: 13,
		rarity: 'common',
	},
	3: {
		attackBonus: 7,
		cost: '175 gp',
		craftingComponent: 'Dire wolf hide',
		saveDC: 15,
		rarity: 'uncommon',
	},
	4: {
		attackBonus: 7,
		cost: '500 gp',
		craftingComponent: 'Dire wolf hide',
		saveDC: 15,
		rarity: 'uncommon',
	},
	5: {
		attackBonus: 9,
		cost: '1250 gp',
		craftingComponent: 'Parchment infused with planar energy',
		saveDC: 17,
		rarity: 'rare',
	},
	6: {
		attackBonus: 9,
		cost: '3000 gp',
		craftingComponent: 'Parchment infused with planar energy',
		saveDC: 17,
		rarity: 'rare',
	},
	7: {
		attackBonus: 10,
		cost: '8000 gp',
		craftingComponent: "Blank pages from a lich's spellbook",
		saveDC: 18,
		rarity: 'veryRare',
	},
	8: {
		attackBonus: 10,
		cost: '20000 gp',
		craftingComponent: "Blank pages from a lich's spellbook",
		saveDC: 18,
		rarity: 'veryRare',
	},
	9: {
		attackBonus: 11,
		cost: '55000 gp',
		craftingComponent: "Parchment made from a dragon's hide",
		saveDC: 19,
		rarity: 'legendary',
	},
};

const shieldProperties = {
	handsFree: 'A5E.shieldProperties.handsFree',
	mirrored: 'A5E.shieldProperties.mirrored',
	spikes: 'A5E.shieldProperties.spikes',
};

/**
 * The set of core shield types in the system.
 * @enum {string}
 */
const shieldTypes = {
	light: 'A5E.ShieldTypeLight',
	medium: 'A5E.ShieldTypeMedium',
	heavy: 'A5E.ShieldTypeHeavy',
	tower: 'A5E.ShieldTypeTower',
};

const shieldBaseACBonus = {
	light: 1,
	medium: 2,
	heavy: 2,
	tower: 2,
};

const spellBookTypes = {
	innate: 'A5E.spellBook.types.innate',
	prepared: 'A5E.spellBook.types.prepared',
	pact: 'A5E.spellBook.types.pact',
	points: 'A5E.spellBook.types.points',
	ritual: 'A5E.spellBook.types.ritual',
};

const spellComponents = {
	vocalized: 'A5E.SpellComponentVocalized',
	seen: 'A5E.SpellComponentSeen',
	material: 'A5E.SpellComponentMaterial',
};

const spellComponentAbbreviations = {
	vocalized: 'A5E.SpellComponentVocalizedAbbr',
	seen: 'A5E.SpellComponentSeenAbbr',
	material: 'A5E.SpellComponentMaterialAbbr',
};

/**
 * Valid spell levels.
 * @enum {string}
 */
const spellLevels = {
	0: 'A5E.SpellLevel0',
	1: 'A5E.SpellLevel1',
	2: 'A5E.SpellLevel2',
	3: 'A5E.SpellLevel3',
	4: 'A5E.SpellLevel4',
	5: 'A5E.SpellLevel5',
	6: 'A5E.SpellLevel6',
	7: 'A5E.SpellLevel7',
	8: 'A5E.SpellLevel8',
	9: 'A5E.SpellLevel9',
} as const;

const spellLevelCost = {
	0: 0,
	1: 2,
	2: 3,
	3: 5,
	4: 6,
	5: 7,
	6: 9,
	7: 10,
	8: 11,
	9: 13,
};

const spellSchools = {
	primary: {
		abjuration: 'A5E.SpellSchoolAbjuration',
		conjuration: 'A5E.SpellSchoolConjuration',
		divination: 'A5E.SpellSchoolDivination',
		enchantment: 'A5E.SpellSchoolEnchantment',
		evocation: 'A5E.SpellSchoolEvocation',
		illusion: 'A5E.SpellSchoolIllusion',
		necromancy: 'A5E.SpellSchoolNecromancy',
		transmutation: 'A5E.SpellSchoolTransmutation',
	},
	secondary: {
		acid: 'A5E.SpellSchoolAcid',
		affliction: 'A5E.SpellSchoolAffliction',
		air: 'A5E.SpellSchoolAir',
		arcane: 'A5E.SpellSchoolArcane',
		architecture: 'A5E.SpellSchoolArchitecture',
		attack: 'A5E.SpellSchoolAttack',
		beasts: 'A5E.SpellSchoolBeasts',
		chaos: 'A5E.SpellSchoolChaos',
		cold: 'A5E.SpellSchoolCold',
		communication: 'A5E.SpellSchoolCommunication',
		compulsion: 'A5E.SpellSchoolCompulsion',
		control: 'A5E.SpellSchoolControl',
		displacement: 'A5E.SpellSchoolDisplacement',
		divine: 'A5E.SpellSchoolDivine',
		dragon: 'A5E.SpellSchoolDragon',
		earth: 'A5E.SpellSchoolEarth',
		enhancement: 'A5E.SpellSchoolEnhancement',
		evil: 'A5E.SpellSchoolEvil',
		fear: 'A5E.SpellSchoolFear',
		fire: 'A5E.SpellSchoolFire',
		force: 'A5E.SpellSchoolForce',
		good: 'A5E.SpellSchoolGood',
		healing: 'A5E.SpellSchoolHealing',
		hearth: 'A5E.SpellSchoolHearth',
		knowledge: 'A5E.SpellSchoolKnowledge',
		law: 'A5E.SpellSchoolLaw',
		lightning: 'A5E.SpellSchoolLightning',
		movement: 'A5E.SpellSchoolMovement',
		multiclass: 'A5E.SpellSchoolMulticlass',
		nature: 'A5E.SpellSchoolNature',
		necrotic: 'A5E.SpellSchoolNecrotic',
		negation: 'A5E.SpellSchoolNegation',
		obscurement: 'A5E.SpellSchoolObscurement',
		planar: 'A5E.SpellSchoolPlanar',
		plants: 'A5E.SpellSchoolPlants',
		poison: 'A5E.SpellSchoolPoison',
		prismatic: 'A5E.SpellSchoolPrismatic',
		protection: 'A5E.SpellSchoolProtection',
		psionic: 'A5E.SpellSchoolPsionic',
		psychic: 'A5E.SpellSchoolPsychic',
		radiant: 'A5E.SpellSchoolRadiant',
		scrying: 'A5E.SpellSchoolScrying',
		senses: 'A5E.SpellSchoolSenses',
		shadow: 'A5E.SpellSchoolShadow',
		shapechanging: 'A5E.SpellSchoolShapechanging',
		sound: 'A5E.SpellSchoolSound',
		storm: 'A5E.SpellSchoolStorm',
		summoning: 'A5E.SpellSchoolSummoning',
		technological: 'A5E.SpellSchoolTechnological',
		telepathy: 'A5E.SpellSchoolTelepathy',
		teleportation: 'A5E.SpellSchoolTeleportation',
		terrain: 'A5E.SpellSchoolTerrain',
		thunder: 'A5E.SpellSchoolThunder',
		time: 'A5E.SpellSchoolTime',
		transformation: 'A5E.SpellSchoolTransformation',
		unarmed: 'A5E.SpellSchoolUnarmed',
		undead: 'A5E.SpellSchoolUndead',
		utility: 'A5E.SpellSchoolUtility',
		water: 'A5E.SpellSchoolWater',
		weaponry: 'A5E.SpellSchoolWeaponry',
		weather: 'A5E.SpellSchoolWeather',
	},
};

/**
 * The set of core skills used in the system.
 * @enum {string}
 */
const skills = {
	acr: 'A5E.skills.acrobatics',
	ani: 'A5E.skills.animalHandling',
	arc: 'A5E.skills.arcana',
	ath: 'A5E.skills.athletics',
	cul: 'A5E.skills.culture',
	dec: 'A5E.skills.deception',
	eng: 'A5E.skills.engineering',
	his: 'A5E.skills.history',
	ins: 'A5E.skills.insight',
	itm: 'A5E.skills.intimidation',
	inv: 'A5E.skills.investigation',
	med: 'A5E.skills.medicine',
	nat: 'A5E.skills.nature',
	prc: 'A5E.skills.perception',
	prf: 'A5E.skills.performance',
	per: 'A5E.skills.persuasion',
	rel: 'A5E.skills.religion',
	sci: 'A5E.skills.science',
	slt: 'A5E.skills.sleightOfHand',
	ste: 'A5E.skills.stealth',
	sur: 'A5E.skills.survival',
};

const skillCriticalTables = {
	acr: 'Compendium.a5e.a5e-roll-tables.RollTable.8q8hhm2qxxpzqety',
	ani: 'Compendium.a5e.a5e-roll-tables.RollTable.vmf9w8gtsdi2h45n',
	arc: 'Compendium.a5e.a5e-roll-tables.RollTable.27u8uhi0v7x4dxwz',
	ath: 'Compendium.a5e.a5e-roll-tables.RollTable.8q8hhm2qxxpzqety',
	cul: 'Compendium.a5e.a5e-roll-tables.RollTable.27u8uhi0v7x4dxwz',
	dec: 'Compendium.a5e.a5e-roll-tables.RollTable.vmf9w8gtsdi2h45n',
	eng: 'Compendium.a5e.a5e-roll-tables.RollTable.27u8uhi0v7x4dxwz',
	his: 'Compendium.a5e.a5e-roll-tables.RollTable.27u8uhi0v7x4dxwz',
	ins: 'Compendium.a5e.a5e-roll-tables.RollTable.vmf9w8gtsdi2h45n',
	itm: 'Compendium.a5e.a5e-roll-tables.RollTable.vmf9w8gtsdi2h45n',
	inv: 'Compendium.a5e.a5e-roll-tables.RollTable.27u8uhi0v7x4dxwz',
	med: 'Compendium.a5e.a5e-roll-tables.RollTable.66wtmckaxsjl2cay',
	nat: 'Compendium.a5e.a5e-roll-tables.RollTable.27u8uhi0v7x4dxwz',
	prc: 'Compendium.a5e.a5e-roll-tables.RollTable.27u8uhi0v7x4dxwz',
	prf: 'Compendium.a5e.a5e-roll-tables.RollTable.vmf9w8gtsdi2h45n',
	per: 'Compendium.a5e.a5e-roll-tables.RollTable.vmf9w8gtsdi2h45n',
	rel: 'Compendium.a5e.a5e-roll-tables.RollTable.27u8uhi0v7x4dxwz',
	slt: 'Compendium.a5e.a5e-roll-tables.RollTable.8q8hhm2qxxpzqety',
	ste: 'Compendium.a5e.a5e-roll-tables.RollTable.8q8hhm2qxxpzqety',
	sur: 'Compendium.a5e.a5e-roll-tables.RollTable.27u8uhi0v7x4dxwz',
};

const skillFumbleTables = {
	acr: 'Compendium.a5e.a5e-roll-tables.RollTable.sckaut8fmaq8l120',
	ani: 'Compendium.a5e.a5e-roll-tables.RollTable.3m0vyh75nnlj42ja',
	arc: 'Compendium.a5e.a5e-roll-tables.RollTable.jbjp515vtjmolbng',
	ath: 'Compendium.a5e.a5e-roll-tables.RollTable.sckaut8fmaq8l120',
	cul: 'Compendium.a5e.a5e-roll-tables.RollTable.jbjp515vtjmolbng',
	dec: 'Compendium.a5e.a5e-roll-tables.RollTable.3m0vyh75nnlj42ja',
	eng: 'Compendium.a5e.a5e-roll-tables.RollTable.jbjp515vtjmolbng',
	his: 'Compendium.a5e.a5e-roll-tables.RollTable.jbjp515vtjmolbng',
	ins: 'Compendium.a5e.a5e-roll-tables.RollTable.3m0vyh75nnlj42ja',
	itm: 'Compendium.a5e.a5e-roll-tables.RollTable.3m0vyh75nnlj42ja',
	inv: 'Compendium.a5e.a5e-roll-tables.RollTable.jbjp515vtjmolbng',
	med: 'Compendium.a5e.a5e-roll-tables.RollTable.ihsspmdmmpj8cyk8',
	nat: 'Compendium.a5e.a5e-roll-tables.RollTable.jbjp515vtjmolbng',
	prc: 'Compendium.a5e.a5e-roll-tables.RollTable.jbjp515vtjmolbng',
	prf: 'Compendium.a5e.a5e-roll-tables.RollTable.3m0vyh75nnlj42ja',
	per: 'Compendium.a5e.a5e-roll-tables.RollTable.3m0vyh75nnlj42ja',
	rel: 'Compendium.a5e.a5e-roll-tables.RollTable.jbjp515vtjmolbng',
	slt: 'Compendium.a5e.a5e-roll-tables.RollTable.sckaut8fmaq8l120',
	ste: 'Compendium.a5e.a5e-roll-tables.RollTable.sckaut8fmaq8l120',
	sur: 'Compendium.a5e.a5e-roll-tables.RollTable.jbjp515vtjmolbng',
};

const skillDefaultAbilities = {
	acr: 'dex',
	ani: 'wis',
	arc: 'int',
	ath: 'str',
	cul: 'int',
	dec: 'cha',
	eng: 'int',
	his: 'int',
	ins: 'wis',
	itm: 'cha',
	inv: 'int',
	med: 'wis',
	nat: 'int',
	prc: 'wis',
	prf: 'cha',
	per: 'cha',
	rel: 'int',
	sci: 'int',
	slt: 'dex',
	ste: 'dex',
	sur: 'wis',
};

/**
 * The set of core skill specialties used in the system.
 */
const skillSpecialties = {
	acr: {
		balancing: 'A5E.skillSpecialties.balancing',
		escapeArtistry: 'A5E.skillSpecialties.escapeArtistry',
		swinging: 'A5E.skillSpecialties.swinging',
		tumbling: 'A5E.skillSpecialties.tumbling',
	},
	ani: {
		calming: 'A5E.skillSpecialties.calming',
		driving: 'A5E.skillSpecialties.driving',
		farming: 'A5E.skillSpecialties.farming',
		riding: 'A5E.skillSpecialties.riding',
		training: 'A5E.skillSpecialties.training',
	},
	arc: {
		aberrations: 'A5E.skillSpecialties.aberrations',
		artifacts: 'A5E.skillSpecialties.artifacts',
		constructs: 'A5E.skillSpecialties.constructs',
		detection: 'A5E.skillSpecialties.detection',
		dragons: 'A5E.skillSpecialties.dragons',
		elementals: 'A5E.skillSpecialties.elementals',
		fey: 'A5E.skillSpecialties.fey',
		forbiddenKnowledge: 'A5E.skillSpecialties.forbiddenKnowledge',
		monstrosities: 'A5E.skillSpecialties.monstrosities',
		oozes: 'A5E.skillSpecialties.oozes',
		thePlanes: 'A5E.skillSpecialties.thePlanes',
		psionics: 'A5E.skillSpecialties.psionics',
		psionicItems: 'A5E.skillSpecialties.psionicItems',
		psionicCreatures: 'A5E.skillSpecialties.psionicCreatures',
	},
	ath: {
		climbing: 'A5E.skillSpecialties.climbing',
		diving: 'A5E.skillSpecialties.diving',
		jumping: 'A5E.skillSpecialties.jumping',
		lifting: 'A5E.skillSpecialties.lifting',
		martialArts: 'A5E.skillSpecialties.martialArts',
		running: 'A5E.skillSpecialties.running',
		swimming: 'A5E.skillSpecialties.swimming',
		throwing: 'A5E.skillSpecialties.throwing',
		zeroG: 'A5E.skillSpecialties.zeroG',
	},
	cul: {
		courtlyManners: 'A5E.skillSpecialties.courtlyManners',
		cuisine: 'A5E.skillSpecialties.cuisine',
		etiquette: 'A5E.skillSpecialties.etiquette',
		fencingProtocol: 'A5E.skillSpecialties.fencingProtocol',
		laws: 'A5E.skillSpecialties.laws',
		linguistics: 'A5E.skillSpecialties.linguistics',
		regionalGoods: 'A5E.skillSpecialties.regionalGoods',
		streetwise: 'A5E.skillSpecialties.streetwise',
		trade: 'A5E.skillSpecialties.trade',
	},
	dec: {
		boasting: 'A5E.skillSpecialties.boasting',
		ciphers: 'A5E.skillSpecialties.ciphers',
		concealingEmotions: 'A5E.skillSpecialties.concealingEmotions',
		liesOfOmission: 'A5E.skillSpecialties.liesOfOmission',
		mimicry: 'A5E.skillSpecialties.mimicry',
	},
	eng: {
		architecture: 'A5E.skillSpecialties.architecture',
		chemistry: 'A5E.skillSpecialties.chemistry',
		explosives: 'A5E.skillSpecialties.explosives',
		gadgetry: 'A5E.skillSpecialties.gadgetry',
		mathematics: 'A5E.skillSpecialties.mathematics',
		mechanicalTraps: 'A5E.skillSpecialties.mechanicalTraps',
		plumbing: 'A5E.skillSpecialties.plumbing',
		robotics: 'A5E.skillSpecialties.robotics',
		siegecraft: 'A5E.skillSpecialties.siegecraft',
		starships: 'A5E.skillSpecialties.starships',
		starshipEngines: 'A5E.skillSpecialties.starshipEngines',
		starshipShields: 'A5E.skillSpecialties.starshipShields',
		weaponry: 'A5E.skillSpecialties.weaponry',
	},
	his: {
		arts: 'A5E.skillSpecialties.arts',
		empires: 'A5E.skillSpecialties.empires',
		genealogy: 'A5E.skillSpecialties.genealogy',
		legends: 'A5E.skillSpecialties.legends',
		militaryHistory: 'A5E.skillSpecialties.militaryHistory',
		wars: 'A5E.skillSpecialties.wars',
	},
	ins: {
		detectingLies: 'A5E.skillSpecialties.detectingLies',
		readingEmotions: 'A5E.skillSpecialties.readingEmotions',
		sensingMotives: 'A5E.skillSpecialties.sensingMotives',
	},
	itm: {
		authority: 'A5E.skillSpecialties.authority',
		ferocity: 'A5E.skillSpecialties.ferocity',
		interrogation: 'A5E.skillSpecialties.interrogation',
		subtleThreats: 'A5E.skillSpecialties.subtleThreats',
		weaponDisplays: 'A5E.skillSpecialties.weaponDisplays',
	},
	inv: {
		appraisal: 'A5E.skillSpecialties.appraisal',
		deciphering: 'A5E.skillSpecialties.deciphering',
		forensics: 'A5E.skillSpecialties.forensics',
		gatheringRumors: 'A5E.skillSpecialties.gatheringRumors',
		research: 'A5E.skillSpecialties.research',
		sensors: 'A5E.skillSpecialties.sensors',
		trapfinding: 'A5E.skillSpecialties.trapfinding',
	},
	med: {
		animals: 'A5E.skillSpecialties.animals',
		autopsy: 'A5E.skillSpecialties.autopsy',
		diseases: 'A5E.skillSpecialties.diseases',
		drugs: 'A5E.skillSpecialties.drugs',
		herbalism: 'A5E.skillSpecialties.herbalism',
		mentalHealth: 'A5E.skillSpecialties.mentalHealth',
		poisons: 'A5E.skillSpecialties.poisons',
		xenobiology: 'A5E.skillSpecialties.xenobiology',
	},
	nat: {
		astronomy: 'A5E.skillSpecialties.astronomy',
		beastLore: 'A5E.skillSpecialties.beastLore',
		farming: 'A5E.skillSpecialties.farming',
		fey: 'A5E.skillSpecialties.fey',
		plantLore: 'A5E.skillSpecialties.plantLore',
		weather: 'A5E.skillSpecialties.weather',
	},
	prc: {
		farsight: 'A5E.skillSpecialties.farsight',
		invisibleObjects: 'A5E.skillSpecialties.invisibleObjects',
		listening: 'A5E.skillSpecialties.listening',
		scent: 'A5E.skillSpecialties.scent',
	},
	prf: {
		acting: 'A5E.skillSpecialties.acting',
		composing: 'A5E.skillSpecialties.composing',
		dancing: 'A5E.skillSpecialties.dancing',
		fineArt: 'A5E.skillSpecialties.fineArt',
		singing: 'A5E.skillSpecialties.singing',
		speaking: 'A5E.skillSpecialties.speaking',
		writing: 'A5E.skillSpecialties.writing',
	},
	per: {
		bribery: 'A5E.skillSpecialties.bribery',
		flattery: 'A5E.skillSpecialties.flattery',
		leadership: 'A5E.skillSpecialties.leadership',
		negotiation: 'A5E.skillSpecialties.negotiation',
		peacemaking: 'A5E.skillSpecialties.peacemaking',
	},
	rel: {
		alignment: 'A5E.skillSpecialties.alignment',
		celestials: 'A5E.skillSpecialties.celestials',
		cults: 'A5E.skillSpecialties.cults',
		fiends: 'A5E.skillSpecialties.fiends',
		gods: 'A5E.skillSpecialties.gods',
		holySymbols: 'A5E.skillSpecialties.holySymbols',
		morality: 'A5E.skillSpecialties.morality',
		prophecy: 'A5E.skillSpecialties.prophecy',
		relics: 'A5E.skillSpecialties.relics',
		undead: 'A5E.skillSpecialties.undead',
	},
	sci: {
		astronomy: 'A5E.skillSpecialties.astronomy',
		chemistry: 'A5E.skillSpecialties.chemistry',
		earthScience: 'A5E.skillSpecialties.earthScience',
		mathematics: 'A5E.skillSpecialties.mathematics',
		physics: 'A5E.skillSpecialties.physics',
		technobabble: 'A5E.skillSpecialties.technobabble',
	},
	slt: {
		distraction: 'A5E.skillSpecialties.distraction',
		legerdemain: 'A5E.skillSpecialties.legerdemain',
		pickpocketing: 'A5E.skillSpecialties.pickpocketing',
	},
	ste: {
		anonymity: 'A5E.skillSpecialties.anonymity',
		camouflage: 'A5E.skillSpecialties.camouflage',
		casing: 'A5E.skillSpecialties.casing',
	},
	sur: {
		astrogation: 'A5E.skillSpecialties.astrogation',
		dungeoneering: 'A5E.skillSpecialties.dungeoneering',
		foraging: 'A5E.skillSpecialties.foraging',
		hunting: 'A5E.skillSpecialties.hunting',
		tracking: 'A5E.skillSpecialties.tracking',
		wayfinding: 'A5E.skillSpecialties.wayfinding',
	},
};

const targetTypes = {
	self: 'A5E.TargetSelf',
	creature: 'A5E.TargetCreature',
	object: 'A5E.TargetObject',
	creatureObject: 'A5E.TargetCreatureObject',
	other: 'A5E.TargetOther',
};

const targetTypesPlural = {
	self: 'A5E.TargetSelf',
	creature: 'A5E.TargetCreaturePlural',
	object: 'A5E.TargetObjectPlural',
	creatureObject: 'A5E.TargetCreatureObjectPlural',
	other: 'A5E.TargetOther',
};

const terrainTypes = {
	abyss: 'A5E.terrainTypes.abyss',
	astralPlane: 'A5E.terrainTypes.astralPlane',
	caverns: 'A5E.terrainTypes.caverns',
	desert: 'A5E.terrainTypes.desert',
	etherealPlane: 'A5E.terrainTypes.etherealPlane',
	forest: 'A5E.terrainTypes.forest',
	grassland: 'A5E.terrainTypes.grassland',
	hell: 'A5E.terrainTypes.hell',
	hills: 'A5E.terrainTypes.hills',
	jungle: 'A5E.terrainTypes.jungle',
	laboratory: 'A5E.terrainTypes.laboratory',
	mountains: 'A5E.terrainTypes.mountains',
	planeOfAir: 'A5E.terrainTypes.planeOfAir',
	planeOfEarth: 'A5E.terrainTypes.planeOfEarth',
	planeOfFire: 'A5E.terrainTypes.planeOfFire',
	planeOfWater: 'A5E.terrainTypes.planeOfWater',
	ruin: 'A5E.terrainTypes.ruin',
	settlement: 'A5E.terrainTypes.settlement',
	sewer: 'A5E.terrainTypes.sewer',
	swamp: 'A5E.terrainTypes.swamp',
	temple: 'A5E.terrainTypes.temple',
	theBleakGate: 'A5E.terrainTypes.theBleakGate',
	theDreaming: 'A5E.terrainTypes.theDreaming',
	tomb: 'A5E.terrainTypes.tomb',
	tundra: 'A5E.terrainTypes.tundra',
	underland: 'A5E.terrainTypes.underland',
	water: 'A5E.terrainTypes.water',
};

const timePeriods = {
	instantaneous: 'A5E.durations.instantaneous',
	round: 'A5E.durations.round',
	turn: 'A5E.durations.turn',
	second: 'A5E.durations.second',
	minute: 'A5E.durations.minute',
	hour: 'A5E.durations.hour',
	day: 'A5E.durations.day',
	week: 'A5E.durations.week',
	month: 'A5E.durations.month',
	year: 'A5E.durations.year',
	permanent: 'A5E.durations.permanent',
	special: 'A5E.durations.special',
};

const timePeriodsPlural = {
	instantaneous: 'A5E.durations.instantaneous',
	round: 'A5E.durations.roundPlural',
	turn: 'A5E.durations.turnPlural',
	second: 'A5E.durations.secondPlural',
	minute: 'A5E.durations.minutePlural',
	hour: 'A5E.durations.hourPlural',
	day: 'A5E.durations.dayPlural',
	week: 'A5E.durations.weekPlural',
	month: 'A5E.durations.monthPlural',
	year: 'A5E.durations.yearPlural',
	permanent: 'A5E.durations.permanent',
	special: 'A5E.durations.special',
};

const tokenDimensions = {
	tiny: 0.5,
	sm: 1,
	med: 1,
	lg: 2,
	huge: 3,
	grg: 4,
	titan: 5,
};

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars.
 * @enum {number}
 */
const tokenHPColors = {
	damage: 0xff0000,
	healing: 0x00ff00,
	temp: 0x66ccff,
};

const toolCategories = {
	artisansTools: 'A5E.ToolsArtisanTools',
	gamingSets: 'A5E.ToolsGamingSets',
	musicalInstruments: 'A5E.instruments.title',
	miscellaneous: 'A5E.ToolsMiscellaneous',
	specialist: 'A5E.ToolsSpecialist',
	vehicles: 'A5E.ToolsVehicles',
	other: 'A5E.ToolsOther',
};

const tools = {
	artisansTools: {
		alchemistsSupplies: 'A5E.ToolAlchemistsSupplies',
		bookbindersKit: 'A5E.ToolBookbindersKit',
		brewersSupplies: 'A5E.ToolBrewersSupplies',
		calligraphersSupplies: 'A5E.ToolCalligraphersSupplies',
		carpentersTools: 'A5E.ToolCarpentersTools',
		cartographersTools: 'A5E.ToolCartographersTools',
		cobblersTools: 'A5E.ToolCobblersTools',
		cooksUtensils: 'A5E.ToolCooksUtensils',
		glassblowersTools: 'A5E.ToolGlassblowersTools',
		jewelersTools: 'A5E.ToolJewelersTools',
		leatherworkersTools: 'A5E.ToolLeatherworkersTools',
		masonsTools: 'A5E.ToolMasonsTools',
		paintersSupplies: 'A5E.ToolPaintersSupplies',
		pottersTools: 'A5E.ToolPottersTools',
		tinkersTools: 'A5E.ToolTinkersTools',
		weaversTools: 'A5E.ToolWeaversTools',
		woodcarversTools: 'A5E.ToolWoodcarversTools',
	},
	gamingSets: {
		diceSet: 'A5E.ToolDiceSet',
		boardGameSet: 'A5E.ToolBoardGameSet',
		playingCardSet: 'A5E.ToolPlayingCardSet',
	},
	musicalInstruments: {
		acousticGuitar: 'A5E.instruments.singular.acousticGuitar',
		bagpipes: 'A5E.instruments.singular.bagpipes',
		casaba: 'A5E.instruments.singular.casaba',
		castanet: 'A5E.instruments.singular.castanet',
		drum: 'A5E.instruments.singular.drum',
		dulcimer: 'A5E.instruments.singular.dulcimer',
		electricGuitar: 'A5E.instruments.singular.electricGuitar',
		flute: 'A5E.instruments.singular.flute',
		harmonica: 'A5E.instruments.singular.harmonica',
		harp: 'A5E.instruments.singular.harp',
		horn: 'A5E.instruments.singular.horn',
		keytar: 'A5E.instruments.singular.keytar',
		lute: 'A5E.instruments.singular.lute',
		lyre: 'A5E.instruments.singular.lyre',
		maraca: 'A5E.instruments.singular.maraca',
		ocarina: 'A5E.instruments.singular.ocarina',
		panFlute: 'A5E.instruments.singular.panFlute',
		saxophone: 'A5E.instruments.singular.saxophone',
		shawm: 'A5E.instruments.singular.shawm',
		theremin: 'A5E.instruments.singular.theremin',
		trombone: 'A5E.instruments.singular.trombone',
		viol: 'A5E.instruments.singular.viol',
		violin: 'A5E.instruments.singular.violin',
	},
	miscellaneous: {
		disguiseKit: 'A5E.ToolDisguiseKit',
		forgeryKit: 'A5E.ToolForgeryKit',
		herbalismKit: 'A5E.ToolHerbalismKit',
		navigatorsTools: 'A5E.ToolNavigatorsTools',
		poisonersKit: 'A5E.ToolPoisonersKit',
		sewingKit: 'A5E.ToolSewingKit',
		smithsTools: 'A5E.ToolSmithsTools',
		thievesTools: 'A5E.ToolThievesTools',
		computers: 'A5E.ToolComputers',
	},
	specialist: {
		computerTechnicianKit: 'A5E.ToolComputerTechnicianKit',
		cyberneticsKit: 'A5E.ToolCyberneticsKit',
		engineersToolbox: 'A5E.ToolEngineersToolbox',
		fieldLaboratory: 'A5E.ToolFieldLaboratory',
		hackingTool: 'A5E.ToolHackingTool',
		medicalPouch: 'A5E.ToolMedicalPouch',
		multiScanner: 'A5E.ToolMultiScanner',
	},
	vehicles: {
		landVehicles: 'A5E.VehicleLand',
		waterVehicles: 'A5E.VehicleWater',
		airVehicles: 'A5E.VehicleAir',
		spaceVehicles: 'A5E.VehicleSpace',
	},
};

const toolsPlural = {
	artisansTools: {
		alchemistsSupplies: 'A5E.ToolAlchemistsSupplies',
		bookbindersKit: 'A5E.ToolBookbindersKitPlural',
		brewersSupplies: 'A5E.ToolBrewersSupplies',
		calligraphersSupplies: 'A5E.ToolCalligraphersSupplies',
		carpentersTools: 'A5E.ToolCarpentersTools',
		cartographersTools: 'A5E.ToolCartographersTools',
		cobblersTools: 'A5E.ToolCobblersTools',
		cooksUtensils: 'A5E.ToolCooksUtensils',
		glassblowersTools: 'A5E.ToolGlassblowersTools',
		jewelersTools: 'A5E.ToolJewelersTools',
		leatherworkersTools: 'A5E.ToolLeatherworkersTools',
		masonsTools: 'A5E.ToolMasonsTools',
		paintersSupplies: 'A5E.ToolPaintersSupplies',
		pottersTools: 'A5E.ToolPottersTools',
		tinkersTools: 'A5E.ToolTinkersTools',
		weaversTools: 'A5E.ToolWeaversTools',
		woodcarversTools: 'A5E.ToolWoodcarversTools',
	},
	gamingSets: {
		diceSet: 'A5E.ToolDiceSetPlural',
		boardGameSet: 'A5E.ToolBoardGameSetPlural',
		playingCardSet: 'A5E.ToolPlayingCardSetPlural',
	},
	musicalInstruments: {
		acousticGuitar: 'A5E.instruments.plural.acousticGuitarPlural',
		bagpipes: 'A5E.instruments.plural.bagpipesPlural',
		casaba: 'A5E.instruments.plural.casabaPlural',
		castanet: 'A5E.instruments.plural.castanetPlural',
		drum: 'A5E.instruments.plural.drumPlural',
		dulcimer: 'A5E.instruments.plural.dulcimerPlural',
		electricGuitar: 'A5E.instruments.plural.electricGuitarPlural',
		flute: 'A5E.instruments.plural.flutePlural',
		harmonica: 'A5E.instruments.plural.harmonicaPlural',
		harp: 'A5E.instruments.plural.harpPlural',
		horn: 'A5E.instruments.plural.hornPlural',
		keytar: 'A5E.instruments.plural.keytarPlural',
		lute: 'A5E.instruments.plural.lutePlural',
		lyre: 'A5E.instruments.plural.lyrePlural',
		maraca: 'A5E.instruments.plural.maracaPlural',
		ocarina: 'A5E.instruments.plural.ocarinaPlural',
		panFlute: 'A5E.instruments.plural.panFlutePlural',
		saxophone: 'A5E.instruments.plural.saxophonePlural',
		shawm: 'A5E.instruments.plural.shawmPlural',
		theremin: 'A5E.instruments.plural.thereminPlural',
		trombone: 'A5E.instruments.plural.trombonePlural',
		viol: 'A5E.instruments.plural.violPlural',
		violin: 'A5E.instruments.plural.violinPlural',
	},
	miscellaneous: {
		disguiseKit: 'A5E.ToolDisguiseKitPlural',
		forgeryKit: 'A5E.ToolForgeryKitPlural',
		herbalismKit: 'A5E.ToolHerbalismKitPlural',
		navigatorsTools: 'A5E.ToolNavigatorsToolsPlural',
		poisonersKit: 'A5E.ToolPoisonersKitPlural',
		sewingKit: 'A5E.ToolSewingKitPlural',
		smithsTools: 'A5E.ToolSmithsToolsPlural',
		thievesTools: 'A5E.ToolThievesToolsPlural',
	},
	specialist: {
		computerTechnicianKit: 'A5E.ToolComputerTechnicianKitPlural',
		cyberneticsKit: 'A5E.ToolCyberneticsKitPlural',
		engineersToolbox: 'A5E.ToolEngineersToolboxPlural',
		fieldLaboratory: 'A5E.ToolFieldLaboratoryPlural',
		hackingTool: 'A5E.ToolHackingToolPlural',
		medicalPouch: 'A5E.ToolMedicalPouchPlural',
		multiScanner: 'A5E.ToolMultiScannerPlural',
	},
	vehicles: {
		landVehicles: 'A5E.VehicleLandPlural',
		waterVehicles: 'A5E.VehicleWaterPlural',
		airVehicles: 'A5E.VehicleAirPlural',
		spaceVehicles: 'A5E.VehicleSpacePlural',
	},
};

const weaponCategories = {
	simple: 'A5E.WeaponsSimple',
	martial: 'A5E.WeaponsMartial',
	rare: 'A5E.WeaponsRare',
	miscellaneous: 'A5E.WeaponsMiscellaneous',
	other: 'A5E.WeaponsOther',
};

/**
 * The set of core weapons used in the system.
 */
const weapons = {
	simple: {
		blaster: 'A5E.WeaponBlaster',
		blowgun: 'A5E.WeaponBlowgun',
		club: 'A5E.WeaponClub',
		dagger: 'A5E.WeaponDagger',
		handaxe: 'A5E.WeaponHandaxe',
		heavyCrossbow: 'A5E.WeaponHeavyCrossbow',
		joltPistol: 'A5E.WeaponJoltPistol',
		greatclub: 'A5E.WeaponGreatclub',
		laserPistol: 'A5E.WeaponLaserPistol',
		lightCrossbow: 'A5E.WeaponLightCrossbow',
		mace: 'A5E.WeaponMace',
		quarterstaff: 'A5E.WeaponQuarterstaff',
		shockMace: 'A5E.WeaponShockMace',
		sickle: 'A5E.WeaponSickle',
		sling: 'A5E.WeaponSling',
		slugger: 'A5E.WeaponSlugger',
		sonicMaul: 'A5E.WeaponSonicMaul',
		spear: 'A5E.WeaponSpear',
		stunStick: 'A5E.WeaponStunStick',
		tacticalBaton: 'A5E.WeaponTacticalBaton',
	},
	martial: {
		bastardSword: 'A5E.WeaponBastardSword',
		battleaxe: 'A5E.WeaponBattleaxe',
		battleGauntlet: 'A5E.WeaponBattleGauntlet',
		bioChakram: 'A5E.WeaponBioChakram',
		brassKnuckles: 'A5E.WeaponBrassKnuckles',
		combatChainsaw: 'A5E.WeaponCombatChainsaw',
		combatKnife: 'A5E.WeaponCombatKnife',
		compositeBow: 'A5E.WeaponCompositeBow',
		dart: 'A5E.WeaponDart',
		duelingDagger: 'A5E.WeaponDuelingDagger',
		duelingSword: 'A5E.WeaponDuelingSword',
		electroHalberd: 'A5E.WeaponElectroHalberd',
		energyCrossbow: 'A5E.WeaponEnergyCrossbow',
		flail: 'A5E.WeaponFlail',
		flameBracer: 'A5E.WeaponFlameBracer',
		flamethrower: 'A5E.WeaponFlamethrower',
		garotte: 'A5E.WeaponGarotte',
		glaive: 'A5E.WeaponGlaive',
		greataxe: 'A5E.WeaponGreataxe',
		greatsword: 'A5E.WeaponGreatsword',
		grenadeLauncher: 'A5E.WeaponGrenadeLauncher',
		halberd: 'A5E.WeaponHalberd',
		handCrossbow: 'A5E.WeaponHandCrossbow',
		hypodermicPistol: 'A5E.WeaponHypodermicPistol',
		ionCannon: 'A5E.WeaponIonCannon',
		javelin: 'A5E.WeaponJavelin',
		lance: 'A5E.WeaponLance',
		lightHammer: 'A5E.WeaponLightHammer',
		longbow: 'A5E.WeaponLongbow',
		longspear: 'A5E.WeaponLongspear',
		longsword: 'A5E.WeaponLongsword',
		maul: 'A5E.WeaponMaul',
		monoWhip: 'A5E.WeaponMonoWhip',
		morningstar: 'A5E.WeaponMorningstar',
		net: 'A5E.WeaponNet',
		netcaster: 'A5E.WeaponNetcaster',
		pike: 'A5E.WeaponPike',
		plasmaSword: 'A5E.WeaponPlasmaSword',
		polaronGatlingGun: 'A5E.WeaponPolaronGatlingGun',
		pulseRifle: 'A5E.WeaponPulseRifle',
		punchingDagger: 'A5E.WeaponPunchingDagger',
		rapier: 'A5E.WeaponRapier',
		saber: 'A5E.WeaponSaber',
		scimitar: 'A5E.WeaponScimitar',
		scythe: 'A5E.WeaponScythe',
		shortbow: 'A5E.WeaponShortbow',
		shortsword: 'A5E.WeaponShortsword',
		shotgun: 'A5E.WeaponShotgun',
		slugRifle: 'A5E.WeaponSlugRifle',
		sniperRifle: 'A5E.WeaponSniperRifle',
		spearThrower: 'A5E.WeaponSpearThrower',
		throwingDagger: 'A5E.WeaponThrowingDagger',
		tkGauntlet: 'A5E.WeaponTKGauntlet',
		trident: 'A5E.WeaponTrident',
		vibroknife: 'A5E.WeaponVibroknife',
		viperRetainer: 'A5E.WeaponViperRetainer',
		warhammer: 'A5E.WeaponWarhammer',
		warPick: 'A5E.WeaponWarPick',
		whip: 'A5E.WeaponWhip',
	},
	rare: {
		assassinsGauntlet: 'A5E.WeaponAssassinsGauntlet',
		battleBook: 'A5E.WeaponBattleBook',
		bootDagger: 'A5E.WeaponBootDagger',
		carbine: 'A5E.WeaponCarbine',
		doubleWeapon: 'A5E.WeaponDoubleWeapon',
		gearedSlingshot: 'A5E.WeaponGearedSlingshot',
		mercurialMaul: 'A5E.WeaponMercurialMaul',
		musket: 'A5E.WeaponMusket',
		pistol: 'A5E.WeaponPistol',
		ratchetingCrossbow: 'A5E.WeaponRatchetingCrossbow',
		revolver: 'A5E.WeaponRevolver',
		ringBlade: 'A5E.WeaponRingBlade',
		shotgun: 'A5E.WeaponShotgun',
		spikedChain: 'A5E.WeaponSpikedChain',
		swordPistol: 'A5E.WeaponSwordPistol',
	},
	miscellaneous: {
		improvised: 'A5E.WeaponImprovised',
		starship: 'A5E.WeaponStarship',
	},
};

/**
 * The set of core weapons used in the system in their plural form.
 */
const weaponsPlural = {
	simple: {
		blaster: 'A5E.WeaponBlasterPlural',
		blowgun: 'A5E.WeaponBlowgunPlural',
		club: 'A5E.WeaponClubPlural',
		dagger: 'A5E.WeaponDaggerPlural',
		handaxe: 'A5E.WeaponHandaxePlural',
		heavyCrossbow: 'A5E.WeaponHeavyCrossbowPlural',
		joltPistol: 'A5E.WeaponJoltPistolPlural',
		greatclub: 'A5E.WeaponGreatclubPlural',
		laserPistol: 'A5E.WeaponLaserPistolPlural',
		lightCrossbow: 'A5E.WeaponLightCrossbowPlural',
		mace: 'A5E.WeaponMacePlural',
		quarterstaff: 'A5E.WeaponQuarterstaffPlural',
		shockMace: 'A5E.WeaponShockMacePlural',
		sickle: 'A5E.WeaponSicklePlural',
		sling: 'A5E.WeaponSlingPlural',
		slugger: 'A5E.WeaponSluggerPlural',
		sonicMaul: 'A5E.WeaponSonicMaulPlural',
		spear: 'A5E.WeaponSpearPlural',
		stunStick: 'A5E.WeaponStunStickPlural',
		tacticalBaton: 'A5E.WeaponTacticalBatonPlural',
	},
	martial: {
		bastardSword: 'A5E.WeaponBastardSwordPlural',
		battleaxe: 'A5E.WeaponBattleaxePlural',
		battleGauntlet: 'A5E.WeaponBattleGauntletPlural',
		bioChakram: 'A5E.WeaponBioChakramPlural',
		brassKnuckles: 'A5E.WeaponBrassKnucklesPlural',
		combatChainsaw: 'A5E.WeaponCombatChainsawPlural',
		combatKnife: 'A5E.WeaponCombatKnifePlural',
		compositeBow: 'A5E.WeaponCompositeBowPlural',
		dart: 'A5E.WeaponDartPlural',
		duelingDagger: 'A5E.WeaponDuelingDaggerPlural',
		duelingSword: 'A5E.WeaponDuelingSwordPlural',
		electroHalberd: 'A5E.WeaponElectroHalberdPlural',
		energyCrossbow: 'A5E.WeaponEnergyCrossbowPlural',
		flail: 'A5E.WeaponFlailPlural',
		flameBracer: 'A5E.WeaponFlameBracerPlural',
		flamethrower: 'A5E.WeaponFlamethrowerPlural',
		garotte: 'A5E.WeaponGarottePlural',
		glaive: 'A5E.WeaponGlaivePlural',
		greataxe: 'A5E.WeaponGreataxePlural',
		greatsword: 'A5E.WeaponGreatswordPlural',
		grenadeLauncher: 'A5E.WeaponGrenadeLauncherPlural',
		halberd: 'A5E.WeaponHalberdPlural',
		handCrossbow: 'A5E.WeaponHandCrossbowPlural',
		hypodermicPistol: 'A5E.WeaponHypodermicPistolPlural',
		ionCannon: 'A5E.WeaponIonCannonPlural',
		javelin: 'A5E.WeaponJavelinPlural',
		lance: 'A5E.WeaponLancePlural',
		lightHammer: 'A5E.WeaponLightHammerPlural',
		longbow: 'A5E.WeaponLongbowPlural',
		longspear: 'A5E.WeaponLongspearPlural',
		longsword: 'A5E.WeaponLongswordPlural',
		maul: 'A5E.WeaponMaulPlural',
		monoWhip: 'A5E.WeaponMonoWhipPlural',
		morningstar: 'A5E.WeaponMorningstarPlural',
		net: 'A5E.WeaponNetPlural',
		netcaster: 'A5E.WeaponNetcasterPlural',
		pike: 'A5E.WeaponPikePlural',
		plasmaSword: 'A5E.WeaponPlasmaSwordPlural',
		polaronGatlingGun: 'A5E.WeaponPolaronGatlingGunPlural',
		pulseRifle: 'A5E.WeaponPulseRiflePlural',
		punchingDagger: 'A5E.WeaponPunchingDaggerPlural',
		rapier: 'A5E.WeaponRapierPlural',
		saber: 'A5E.WeaponSaberPlural',
		scimitar: 'A5E.WeaponScimitarPlural',
		scythe: 'A5E.WeaponScythePlural',
		shortbow: 'A5E.WeaponShortbowPlural',
		shortsword: 'A5E.WeaponShortswordPlural',
		shotgun: 'A5E.WeaponShotgunPlural',
		slugRifle: 'A5E.WeaponSlugRiflePlural',
		sniperRifle: 'A5E.WeaponSniperRiflePlural',
		spearThrower: 'A5E.WeaponSpearThrowerPlural',
		throwingDagger: 'A5E.WeaponThrowingDaggerPlural',
		tkGauntlet: 'A5E.WeaponTKGauntletPlural',
		trident: 'A5E.WeaponTridentPlural',
		vibroknife: 'A5E.WeaponVibroknifePlural',
		viperRetainer: 'A5E.WeaponViperRetainerPlural',
		warhammer: 'A5E.WeaponWarhammerPlural',
		warPick: 'A5E.WeaponWarPickPlural',
		whip: 'A5E.WeaponWhipPlural',
	},
	rare: {
		assassinsGauntlet: 'A5E.WeaponAssassinsGauntletPlural',
		battleBook: 'A5E.WeaponBattleBookPlural',
		bootDagger: 'A5E.WeaponBootDaggerPlural',
		carbine: 'A5E.WeaponCarbinePlural',
		doubleWeapon: 'A5E.WeaponDoubleWeaponPlural',
		gearedSlingshot: 'A5E.WeaponGearedSlingshotPlural',
		mercurialMaul: 'A5E.WeaponMercurialMaulPlural',
		musket: 'A5E.WeaponMusketPlural',
		pistol: 'A5E.WeaponPistolPlural',
		ratchetingCrossbow: 'A5E.WeaponRatchetingCrossbowPlural',
		revolver: 'A5E.WeaponRevolverPlural',
		ringBlade: 'A5E.WeaponRingBladePlural',
		shotgun: 'A5E.WeaponShotgunPlural',
		spikedChain: 'A5E.WeaponSpikedChainPlural',
		swordPistol: 'A5E.WeaponSwordPistolPlural',
	},
	miscellaneous: {
		improvised: 'A5E.WeaponImprovisedPlural',
		starship: 'A5E.WeaponStarshipPlural',
	},
};

/**
 * The set of core weapon augments used in the system.
 * @enum {string}
 */
const weaponAugments = {
	biometric: 'A5E.weaponAugments.biometric',
	burst: 'A5E.weaponAugments.burst',
	concealed: 'A5E.weaponAugments.concealed',
	energy: 'Energy',
	longRange: 'A5E.weaponAugments.longRange',
	mounted: 'A5E.weaponAugments.mounted',
	overkill: 'A5E.weaponAugments.overkill',
	repeating: 'A5E.weaponAugments.repeating',
	scoped: 'A5E.weaponAugments.scoped',
	toggled: 'A5E.weaponAugments.toggled',
};

const energyProperties = {
	force: 'Force',
	laser: 'Laser',
	plasma: 'Plasma',
	shock: 'Shock',
	sonic: 'Sonic',
};

/**
 * The set of core weapon propeties used in the system.
 * @enum {string}
 */
const weaponProperties = {
	ammunition: 'A5E.weaponProperties.ammunition',
	aquatic: 'A5E.weaponProperties.aquatic',
	areaFire: 'A5E.weaponProperties.areaFire',
	blackPowderPyrotechnics: 'A5E.weaponProperties.blackPowderPyrotechnics',
	breaker: 'A5E.weaponProperties.breaker',
	burstFire: 'A5E.weaponProperties.burstFire',
	clubbing: 'A5E.weaponProperties.clubbing',
	compounding: 'A5E.weaponProperties.compounding',
	defensive: 'A5E.weaponProperties.defensive',
	directFire: 'A5E.weaponProperties.directFire',
	dualWielding: 'A5E.weaponProperties.dualWielding',
	exotic: 'A5E.weaponProperties.exotic',
	finesse: 'A5E.weaponProperties.finesse',
	flamboyant: 'A5E.weaponProperties.flamboyant',
	guidedFire: 'A5E.weaponProperties.guidedFire',
	hailOfLead: 'A5E.weaponProperties.hailOfLead',
	handMounted: 'A5E.weaponProperties.handMounted',
	heavy: 'A5E.weaponProperties.heavy',
	inaccurate: 'A5E.weaponProperties.inaccurate',
	indirectFire: 'A5E.weaponProperties.indirectFire',
	loading: 'A5E.weaponProperties.loading',
	menacing: 'A5E.weaponProperties.menacing',
	misfire: 'A5E.weaponProperties.misfire',
	mounted: 'A5E.weaponProperties.mounted',
	muzzleLoading: 'A5E.weaponProperties.muzzleLoading',
	overkill: 'A5E.weaponProperties.overkill',
	parrying: 'A5E.weaponProperties.parrying',
	parryingImmunity: 'A5E.weaponProperties.parryingImmunity',
	punching: 'A5E.weaponProperties.punching',
	quickdraw: 'A5E.weaponProperties.quickdraw',
	range: 'A5E.weaponProperties.range',
	rebounding: 'A5E.objects.properties.rebounding',
	reach: 'A5E.weaponProperties.reach',
	reload: 'A5E.weaponProperties.reload',
	rifled: 'A5E.weaponProperties.rifled',
	scatter: 'A5E.weaponProperties.scatter',
	shock: 'A5E.weaponProperties.shock',
	simple: 'A5E.weaponProperties.simple',
	stealthy: 'A5E.objects.properties.stealthy',
	storage: 'A5E.objects.properties.storage',
	surpriseShot: 'A5E.weaponProperties.surpriseShot',
	thrown: 'A5E.weaponProperties.thrown',
	triggerCharge: 'A5E.weaponProperties.triggerCharge',
	trip: 'A5E.weaponProperties.trip',
	twoHanded: 'A5E.weaponProperties.twoHanded',
	versatile: 'A5E.weaponProperties.versatile',
	vicious: 'A5E.weaponProperties.vicious',
};

const breakerProperties = {
	wood: 'Wood',
	stone: 'Stone',
};

const defensiveProperties = {
	light: 'Light',
	medium: 'Medium',
	heavy: 'Heavy',
};

const versatileOptions = {
	d6: 'd6',
	d8: 'd8',
	d10: 'd10',
	d12: 'd12',
};

/* ------------------------------------------------- */
/*                    Object                         */
/* ------------------------------------------------- */

const A5E = {
	// Constants
	ARMOR_MODES,
	CHARACTER_EXP_LEVELS,
	CR_EXP_LEVELS,
	DAMAGED_STATES,
	DICE_ROLL_MODES,
	EQUIPPED_STATES,
	PREPARED_STATES,
	ROLL_MODE,

	// Config Objects
	abilities,
	abilityAbbreviations,
	abilityActivationTypes,
	abilityActivationTypesPlural,
	actionOptions,
	actorSizes,
	originItemTypes,
	alignments,
	ammunitionProperties,
	appliedArmorTypes,
	areaIcons,
	areaTypes,
	areaTemplates,
	armor,
	armorModes,
	armorMods,
	armorProperties,
	armorPlural,
	attackTypes,
	carryCapacityMultiplier,
	capacityTypes,
	chatCardTypes,
	conditions,
	creatureTypes,
	damagedStates,
	baseScalingModes,
	targetScalingModes,
	damageTypes,
	damageColors,
	defaultActorImportCompendia,
	equippedStates,
	expertiseDiceSidesMap,
	featureTypes,
	healingTypes,
	healingColors,
	itemRarity,
	itemTechLevels,
	itemTypes,
	inventoryFilters,
	knackTypes,
	languages,
	maneuverDegrees,
	maneuverTraditions,
	materialProperties,
	flaws,
	modPorts,
	movement,
	movementAbbreviations,
	distanceUnits,
	distanceAbbreviations,
	visionUnits,
	objectTypes,
	objectTypesPlural,
	preparedStates,
	psionicDisciplines,
	rangeDescriptors,
	rangeValues,
	repairTools,
	resourceRecoveryOptions,
	rollModes,
	rollTypes,
	saveDCOptions,
	senses,
	scrollData,
	shieldProperties,
	shieldTypes,
	shieldBaseACBonus,
	spellBookTypes,
	spellComponents,
	spellComponentAbbreviations,
	spellLevels,
	spellLevelCost,
	spellSchools,
	skills,
	skillCriticalTables,
	skillFumbleTables,
	skillDefaultAbilities,
	skillSpecialties,
	targetTypes,
	targetTypesPlural,
	terrainTypes,
	timePeriods,
	timePeriodsPlural,
	tokenDimensions,
	tokenHPColors,
	toolCategories,
	tools,
	toolsPlural,
	weaponCategories,
	weapons,
	weaponsPlural,
	weaponAugments,
	weaponProperties,
	breakerProperties,
	defensiveProperties,
	energyProperties,
	versatileOptions,

	// Function Properties
	// These are purposefully done first
	...registerDocumentConfig(),
	...registerClassesConfig(),
	...registerContextsConfig(),
	...registerGrantsConfig(),

	...registerActionsConfig(),
	...registerActiveEffectConfig(),
	...registerBonusesConfig(),
	...registerCharacterClassesConfig(),
	...registerEncounterElements(),
	...registerEffectGroupConfig(),
	...registerEffectLocalizationConfig(),
	...registerModuleIncompatibilities(),
	...registerPremiumContentConfig(),
	...registerPublisherConfig(),
	...registerReducerConfig(),
	...registerSettingsConfig(),
	PRELOCALIZED_KEYS,
};

// These are too complex to be typed to they go after
registerFilterConfig(A5E);

// export default A5E;

export { A5E };
