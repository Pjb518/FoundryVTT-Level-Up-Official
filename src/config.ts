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
	action: 'A5E.ActionActivationAction',
	bonusAction: 'A5E.ActionActivationBonusAction',
	day: 'A5E.DurationDay',
	hour: 'A5E.DurationHour',
	lairAction: 'A5E.ActionActivationLairAction',
	legendaryAction: 'A5E.ActionActivationLegendaryAction',
	minute: 'A5E.DurationMinute',
	none: 'A5E.ActionActivationNone',
	objectInteraction: 'A5E.ActionActivationObjectInteraction',
	reaction: 'A5E.ActionActivationReaction',
	special: 'A5E.ActionActivationSpecial',
};

/**
 * Localized abbreviations for plural activation costs.
 * @enum {string}
 */
const abilityActivationTypesPlural = {
	action: 'A5E.ActionActivationActionPlural',
	bonusAction: 'A5E.ActionActivationBonusActionPlural',
	day: 'A5E.DurationDayPlural',
	hour: 'A5E.DurationHourPlural',
	lairAction: 'A5E.ActionActivationLairActionPlural',
	legendaryAction: 'A5E.ActionActivationLegendaryActionPlural',
	minute: 'A5E.DurationMinutePlural',
	none: 'A5E.ActionActivationNone',
	objectInteraction: 'A5E.ActionActivationObjectInteractionPlural',
	reaction: 'A5E.ActionActivationReaction',
	special: 'A5E.ActionActivationSpecial',
};

const actionOptions = {
	abilityCheck: 'A5E.ActionOptionAbilityCheck',
	attack: 'A5E.ActionOptionAttack',
	damage: 'A5E.ActionOptionDamage',
	healing: 'A5E.ActionOptionHealing',
	savingThrow: 'A5E.ActionOptionSavingThrow',
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
	explosive: 'A5E.AmmunitionPropertyExplosive',
	flaming: 'A5E.AmmunitionPropertyFlaming',
	punching: 'A5E.AmmunitionPropertyPunching',
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
	circle: 'A5E.AreaCircle',
	cone: 'A5E.AreaCone',
	cube: 'A5E.AreaCube',
	cylinder: 'A5E.AreaCylinder',
	emanation: 'A5E.AreaEmanation',
	line: 'A5E.AreaLine',
	sphere: 'A5E.AreaSphere',
	square: 'A5E.AreaSquare',
	wall: 'A5E.AreaWall',
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
	light: 'A5E.ArmorLight',
	medium: 'A5E.ArmorMedium',
	heavy: 'A5E.ArmorHeavy',
	shield: 'A5E.ArmorShield',
};

const armorModes = {
	1: 'A5E.armorClass.modes.add',
	2: 'A5E.armorClass.modes.override',
};

const armorMods = {
	biosensors: 'A5E.ArmorModBiosensors',
	dronePort: 'A5E.ArmorModDronePort',
	environmentalRecycling: 'A5E.ArmorModEnvironmentalRecycling',
	floodlights: 'A5E.ArmorModFloodlights',
	gliderWings: 'A5E.ArmorModGliderWings',
	grapplingHook: 'A5E.ArmorModGrapplingHook',
	groundAnchors: 'A5E.ArmorModGroundAnchors',
	hazmatSealing: 'A5E.ArmorModHazmatSealing',
	improvedColdShielding: 'A5E.ArmorModImprovedColdShielding',
	improvedHeatShielding: 'A5E.ArmorModImprovedHeatShielding',
	improvedWeaponHatch: 'A5E.ArmorModImprovedWeaponHatch',
	integratedFirstAid: 'A5E.ArmorModIntegratedFirstAid',
	integratedJetpack: 'A5E.ArmorModIntegratedJetpack',
	integratedTool: 'A5E.ArmorModIntegratedTool',
	kineticAssistance: 'A5E.ArmorModKineticAssistance',
	massJammer: 'A5E.ArmorModMassJammer',
	mindshielding: 'A5E.ArmorModMindshielding',
	nightvisionGoggles: 'A5E.ArmorModNightvisionGoggles',
	personalJammer: 'A5E.ArmorModPersonalJammer',
	pocket: 'A5E.ArmorModPocket',
	powerClaw: 'A5E.ArmorModPowerClaw',
	rechargePort: 'A5E.ArmorModRechargePort',
	reconApparatus: 'A5E.ArmorModReconApparatus',
	repairKit: 'A5E.ArmorModRepairKit',
	secondaryArmorPlating: 'A5E.ArmorModSecondaryArmorPlating',
	weaponHatch: 'A5E.ArmorModWeaponHatch',
};

/**
 * The set of core armor properties in the system.
 * @enum {string}
 */
const armorProperties = {
	camouflaged: 'A5E.ArmorPropertyCamouflaged',
	cloaking: 'A5E.ArmorPropertyCloaking',
	coldShielding: 'A5E.ArmorPropertyColdShielding',
	greased: 'A5E.ArmorPropertyGreased',
	heatShielding: 'A5E.ArmorPropertyHeatShielding',
	mirrored: 'A5E.ArmorPropertyMirrored',
	shearThickening: 'A5E.ArmorPropertyShearThickening',
	spiked: 'A5E.ArmorPropertySpiked',
	stealthy: 'A5E.objectProperties.stealthy',
	storage: 'A5E.objectProperties.storage',
};

/**
 * The set of core armor types in the system in plural form.
 * @enum {string}
 */
const armorPlural = {
	light: 'A5E.ArmorLight',
	medium: 'A5E.ArmorMedium',
	heavy: 'A5E.ArmorHeavy',
	shield: 'A5E.ArmorShieldPlural',
};

const attackTypes = {
	meleeWeaponAttack: 'A5E.AttackTypeMeleeWeapon',
	rangedWeaponAttack: 'A5E.AttackTypeRangedWeapon',
	meleeSpellAttack: 'A5E.AttackTypeMeleeSpell',
	rangedSpellAttack: 'A5E.AttackTypeRangedSpell',
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
	bulk: 'A5E.CapacityTypeBulk',
	count: 'A5E.CapacityTypeCount',
	weight: 'A5E.CapacityTypeWeight',
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
	blinded: 'A5E.ConditionBlinded',
	bloodied: 'A5E.ConditionBloodied',
	charmed: 'A5E.ConditionCharmed',
	concentration: 'A5E.ConditionConcentration',
	confused: 'A5E.ConditionConfused',
	corruption: 'A5E.ConditionCorruption',
	dazzled: 'A5E.ConditionDazzled',
	deafened: 'A5E.ConditionDeafened',
	doomed: 'A5E.ConditionDoomed',
	encumbered: 'A5E.ConditionEncumbered',
	enervated: 'A5E.ConditionEnervated',
	fatigue: 'A5E.ConditionFatigue',
	fixated: 'A5E.ConditionFixated',
	frightened: 'A5E.ConditionFrightened',
	grappled: 'A5E.ConditionGrappled',
	hungover: 'A5E.ConditionHungover',
	incapacitated: 'A5E.ConditionIncapacitated',
	inebriated: 'A5E.ConditionInebriated',
	invisible: 'A5E.ConditionInvisible',
	paralyzed: 'A5E.ConditionParalyzed',
	petrified: 'A5E.ConditionPetrified',
	poisoned: 'A5E.ConditionPoisoned',
	prone: 'A5E.ConditionProne',
	rattled: 'A5E.ConditionRattled',
	restrained: 'A5E.ConditionRestrained',
	slowed: 'A5E.ConditionSlowed',
	strife: 'A5E.ConditionStrife',
	stunned: 'A5E.ConditionStunned',
	unconscious: 'A5E.ConditionUnconscious',
};

/**
 * The default creature types.
 * @enum {string}
 */
const creatureTypes = {
	aberration: 'A5E.CreatureAberration',
	beast: 'A5E.CreatureBeast',
	celestial: 'A5E.CreatureCelestial',
	construct: 'A5E.CreatureConstruct',
	dragon: 'A5E.CreatureDragon',
	elemental: 'A5E.CreatureElemental',
	fey: 'A5E.CreatureFey',
	fiend: 'A5E.CreatureFiend',
	giant: 'A5E.CreatureGiant',
	humanoid: 'A5E.CreatureHumanoid',
	monstrosity: 'A5E.CreatureMonstrosity',
	ooze: 'A5E.CreatureOoze',
	plant: 'A5E.CreaturePlant',
	undead: 'A5E.CreatureUndead',
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
	background: 'A5E.FeatureBackground',
	boon: 'A5E.FeatureBoon',
	class: 'A5E.FeatureClass',
	culture: 'A5E.FeatureCulture',
	destiny: 'A5E.FeatureDestiny',
	feat: 'A5E.FeatureFeat',
	heritage: 'A5E.FeatureHeritage',
	knack: 'A5E.FeatureKnack',
	legendaryAction: 'A5E.FeatureLegendaryAction',
	naturalWeapon: 'A5E.FeatureNaturalWeapon',
	other: 'A5E.FeatureOther',
};

/**
 * The set of core healing types in the system.
 * @enum {string}
 */
const healingTypes = {
	healing: 'A5E.Healing',
	temporaryHealing: 'A5E.HealingTemporary',
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
	interaction: 'TYPES.Item.interaction',
	maneuver: 'TYPES.Item.maneuver',
	object: 'TYPES.Item.object',
	spell: 'TYPES.Item.spell',
};

const interactionTypes = {
	journey: 'A5E.InteractionJourney',
	other: 'A5E.InteractionOther',
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
	0: 'A5E.ManeuverBasic',
	1: 'A5E.ManeuverDegree1',
	2: 'A5E.ManeuverDegree2',
	3: 'A5E.ManeuverDegree3',
	4: 'A5E.ManeuverDegree4',
	5: 'A5E.ManeuverDegree5',
};

const maneuverTraditions = {
	aceStarfighter: 'A5E.maneuverTraditions.aceStarfighter',
	adamantMountain: 'A5E.maneuverTraditions.adamantMountain',
	arcaneArtillery: 'A5E.maneuverTraditions.arcaneArtillery',
	arcaneKnight: 'A5E.maneuverTraditions.arcaneKnight',
	awakenedMind: 'A5E.maneuverTraditions.awakenedMind',
	beastUnity: 'A5E.maneuverTraditions.beastUnity',
	bitingZephyr: 'A5E.maneuverTraditions.bitingZephyr',
	blazingStarglaive: 'A5E.maneuverTraditions.blazingStarglaive',
	comedicJabs: 'A5E.maneuverTraditions.comedicJabs',
	cuttingOmen: 'A5E.maneuverTraditions.cuttingOmen',
	eldritchBlackguard: 'A5E.maneuverTraditions.eldritchBlackguard',
	gallantHeart: 'A5E.maneuverTraditions.gallantHeart',
	grindingCog: 'A5E.maneuverTraditions.grindingCog',
	mindfulBody: 'A5E.maneuverTraditions.mindfulBody',
	mirrorsGlint: 'A5E.maneuverTraditions.mirrorsGlint',
	mistAndShade: 'A5E.maneuverTraditions.mistAndShade',
	rapidCurrent: 'A5E.maneuverTraditions.rapidCurrent',
	razorsEdge: 'A5E.maneuverTraditions.razorsEdge',
	sanctifiedSteel: 'A5E.maneuverTraditions.sanctifiedSteel',
	sanguineKnot: 'A5E.maneuverTraditions.sanguineKnot',
	selflessSentinel: 'A5E.maneuverTraditions.selflessSentinel',
	spiritedSteed: 'A5E.maneuverTraditions.spiritedSteed',
	temperedIron: 'A5E.maneuverTraditions.temperedIron',
	toothAndClaw: 'A5E.maneuverTraditions.toothAndClaw',
	unendingWheel: 'A5E.maneuverTraditions.unendingWheel',
	viciousVein: 'A5E.maneuverTraditions.viciousVein',
	vipersFangs: 'A5E.maneuverTraditions.vipersFangs',
};

const materialProperties = {
	comfortable: 'A5E.MaterialPropertyComfortable',
	feybane: 'A5E.MaterialPropertyFeybane',
	flaw: 'A5E.MaterialPropertyFlaw',
	fortified: 'A5E.MaterialPropertyFortified',
	hackable: 'A5E.MaterialPropertyHackable',
	hardy: 'A5E.MaterialPropertyHardy',
	highQuality: 'A5E.MaterialPropertyHighQuality',
	lightweight: 'A5E.MaterialPropertyLightweight',
	lowMaintenance: 'A5E.MaterialPropertyLowMaintenance',
	rust: 'A5E.MaterialPropertyRust',
	silvered: 'A5E.MaterialPropertySilvered',
	spacefaring: 'A5E.MaterialPropertySpacefaring',
	underarmor: 'A5E.MaterialPropertyUnderarmor',
	weighty: 'A5E.MaterialPropertyWeighty',
	wild: 'A5E.MaterialPropertyWild',
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
};

/**
 * The set of core movement types in the system.
 * @enum {string}
 */
const movement = {
	walk: 'A5E.MovementWalkingSpeed',
	burrow: 'A5E.MovementBurrowingSpeed',
	climb: 'A5E.MovementClimbingSpeed',
	fly: 'A5E.MovementFlyingSpeed',
	swim: 'A5E.MovementSwimmingSpeed',
};

/**
 * The set of core movement types in the system.
 * @enum {string}
 */
const movementAbbreviations = {
	walk: 'A5E.MovementWalkingSpeedAbbr',
	burrow: 'A5E.MovementBurrowingSpeedAbbr',
	climb: 'A5E.MovementClimbingSpeedAbbr',
	fly: 'A5E.MovementFlyingSpeedAbbr',
	swim: 'A5E.MovementSwimmingSpeedAbbr',
};

/**
 * @enum {string}
 */
const distanceUnits = {
	feet: 'A5E.DistanceUnitFeet',
	miles: 'A5E.DistanceUnitMiles',
	meters: 'A5E.DistanceUnitMeters',
	kilometers: 'A5E.DistanceUnitKilometers',
};

const distanceAbbreviations = {
	feet: 'A5E.DistanceFeetAbbr',
	miles: 'A5E.DistanceMilesAbbr',
	meters: 'A5E.DistanceMetersAbbr',
	kilometers: 'A5E.DistanceKilometersAbbr',
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
	armor: 'A5E.ObjectTypeArmor',
	ammunition: 'A5E.ObjectTypeAmmunition',
	clothing: 'A5E.ObjectTypeClothing',
	consumable: 'A5E.ObjectTypeConsumable',
	container: 'A5E.ObjectTypeContainer',
	helm: 'A5E.ObjectTypeHelm',
	jewelry: 'A5E.ObjectTypeJewelry',
	miscellaneous: 'A5E.ObjectTypeMiscellaneous',
	shield: 'A5E.ObjectTypeShield',
	tool: 'A5E.ObjectTypeTool',
	weapon: 'A5E.ObjectTypeWeapon',
};

/**
 * The set of object subtypes available within the system.
 * @enum {string}
 */
const objectTypesPlural = {
	armor: 'A5E.ObjectTypeArmorPlural',
	ammunition: 'A5E.ObjectTypeAmmunition',
	clothing: 'A5E.ObjectTypeClothing',
	consumable: 'A5E.ObjectTypeConsumablePlural',
	container: 'A5E.ObjectTypeContainerPlural',
	helm: 'A5E.ObjectTypeHelmPlural',
	jewelry: 'A5E.ObjectTypeJewelry',
	miscellaneous: 'A5E.ObjectTypeMiscellaneous',
	shield: 'A5E.ObjectTypeShieldPlural',
	tool: 'A5E.ObjectTypeToolPlural',
	weapon: 'A5E.ObjectTypeWeaponPlural',
};

const preparedStates = {
	0: 'A5E.preparedState.unprepared',
	1: 'A5E.preparedState.prepared',
	2: 'A5E.preparedState.alwaysPrepared',
};

const psionicDisciplines = {
	dynakinetic: 'A5E.PsionicDisciplineDynakinetic',
	kinesthetic: 'A5E.PsionicDisciplineKinesthetic',
	telekinetic: 'A5E.PsionicDisciplineTelekinetic',
	telepathic: 'A5E.PsionicDisciplineTelepathic',
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
};

const resourceRecoveryOptions = {
	shortRest: 'A5E.RestShort',
	longRest: 'A5E.RestLong',
	recharge: 'A5E.ItemRecharge',
	round: 'A5E.DurationRound',
	turn: 'A5E.DurationTurn',
	minute: 'A5E.DurationMinute',
	hour: 'A5E.DurationHour',
	day: 'A5E.DurationDay',
	week: 'A5E.DurationWeek',
	month: 'A5E.DurationMonth',
	year: 'A5E.DurationYear',
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
	instantaneous: 'A5E.DurationInstantaneous',
	round: 'A5E.DurationRound',
	turn: 'A5E.DurationTurn',
	second: 'A5E.DurationSecond',
	minute: 'A5E.DurationMinute',
	hour: 'A5E.DurationHour',
	day: 'A5E.DurationDay',
	week: 'A5E.DurationWeek',
	month: 'A5E.DurationMonth',
	year: 'A5E.DurationYear',
	permanent: 'A5E.DurationPermanent',
	special: 'A5E.DurationSpecial',
};

const timePeriodsPlural = {
	instantaneous: 'A5E.DurationInstantaneous',
	round: 'A5E.DurationRoundPlural',
	turn: 'A5E.DurationTurnPlural',
	second: 'A5E.DurationSecondPlural',
	minute: 'A5E.DurationMinutePlural',
	hour: 'A5E.DurationHourPlural',
	day: 'A5E.DurationDayPlural',
	week: 'A5E.DurationWeekPlural',
	month: 'A5E.DurationMonthPlural',
	year: 'A5E.DurationYearPlural',
	permanent: 'A5E.DurationPermanent',
	special: 'A5E.DurationSpecial',
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
	musicalInstruments: 'A5E.MusicalInstruments',
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
		acousticGuitar: 'A5E.InstrumentAcousticGuitar',
		bagpipes: 'A5E.InstrumentBagpipes',
		casaba: 'A5E.InstrumentCasaba',
		castanet: 'A5E.InstrumentCastanet',
		drum: 'A5E.InstrumentDrum',
		dulcimer: 'A5E.InstrumentDulcimer',
		electricGuitar: 'A5E.InstrumentElectricGuitar',
		flute: 'A5E.InstrumentFlute',
		harmonica: 'A5E.InstrumentHarmonica',
		harp: 'A5E.InstrumentHarp',
		horn: 'A5E.InstrumentHorn',
		keytar: 'A5E.InstrumentKeytar',
		lute: 'A5E.InstrumentLute',
		lyre: 'A5E.InstrumentLyre',
		maraca: 'A5E.InstrumentMaraca',
		ocarina: 'A5E.InstrumentOcarina',
		panFlute: 'A5E.InstrumentPanFlute',
		saxophone: 'A5E.InstrumentSaxophone',
		shawm: 'A5E.InstrumentShawm',
		theremin: 'A5E.InstrumentTheremin',
		trombone: 'A5E.InstrumentTrombone',
		viol: 'A5E.InstrumentViol',
		violin: 'A5E.InstrumentViolin',
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
		acousticGuitar: 'A5E.InstrumentAcousticGuitarPlural',
		bagpipes: 'A5E.InstrumentBagpipesPlural',
		casaba: 'A5E.InstrumentCasabaPlural',
		castanet: 'A5E.InstrumentCastanetPlural',
		drum: 'A5E.InstrumentDrumPlural',
		dulcimer: 'A5E.InstrumentDulcimerPlural',
		electricGuitar: 'A5E.InstrumentElectricGuitarPlural',
		flute: 'A5E.InstrumentFlutePlural',
		harmonica: 'A5E.InstrumentHarmonicaPlural',
		harp: 'A5E.InstrumentHarpPlural',
		horn: 'A5E.InstrumentHornPlural',
		keytar: 'A5E.InstrumentKeytarPlural',
		lute: 'A5E.InstrumentLutePlural',
		lyre: 'A5E.InstrumentLyrePlural',
		maraca: 'A5E.InstrumentMaracaPlural',
		ocarina: 'A5E.InstrumentOcarinaPlural',
		panFlute: 'A5E.InstrumentPanFlutePlural',
		saxophone: 'A5E.InstrumentSaxophonePlural',
		shawm: 'A5E.InstrumentShawmPlural',
		theremin: 'A5E.InstrumentTheremin',
		trombone: 'A5E.InstrumentTrombonePlural',
		viol: 'A5E.InstrumentViolPlural',
		violin: 'A5E.InstrumentViolinPlural',
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
	rebounding: 'A5E.objectProperties.rebounding',
	reach: 'A5E.weaponProperties.reach',
	reload: 'A5E.weaponProperties.reload',
	rifled: 'A5E.weaponProperties.rifled',
	scatter: 'A5E.weaponProperties.scatter',
	shock: 'A5E.weaponProperties.shock',
	simple: 'A5E.weaponProperties.simple',
	stealthy: 'A5E.objectProperties.stealthy',
	storage: 'A5E.objectProperties.storage',
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
	interactionTypes,
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
