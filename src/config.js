import registerActiveEffectConfig from './config/registerActiveEffectConfig';
import registerBonusesConfig from './config/registerBonusesConfig';
import registerCharacterClassesConfig from './config/registerCharacterClassesConfig';
import registerConsumerConfig from './config/registerConsumerConfig';
import registerContextsConfig from './config/registerContextsConfig';
import registerDocumentConfig from './config/registerDocumentConfig';
import registerEncounterElements from './config/registerEncounterElements';
import registerEffectGroupConfig from './config/registerEffectGroupConfig';
import registerEffectLocalizationConfig from './config/registerEffectLocalizationConfig';
import registerFilterConfig from './config/registerFilterConfig';
import registerGrantsConfig from './config/registerGrantsConfig';
import registerModuleIncompatibilities from './config/registerModuleIncompatibilities';
import registerPreLocalizationProperties from './config/registerPreLocalizationProperties';
import registerPremiumContentConfig from './config/registerPremiumContentConfig';
import registerPublisherConfig from './config/registerPublisherConfig';
import registerReducerConfig from './config/registerReducerConfig';
import registerSettingsConfig from './config/registerSettingsConfig';

const A5E = {};

A5E.DAMAGED_STATES = {
  INTACT: 0,
  DAMAGED: 1,
  BROKEN: 2
};

A5E.DICE_ROLL_MODES = {
  blindroll: 'A5E.diceRollModes.blind',
  gmroll: 'A5E.diceRollModes.gm',
  publicroll: 'A5E.diceRollModes.public',
  selfroll: 'A5E.diceRollModes.self'
};

/**
 * XP required to achieve each character level.
 * @type {number[]}
 */
A5E.CHARACTER_EXP_LEVELS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000,
  165000, 195000, 225000, 265000, 305000, 355000
];

/**
 * XP granted for each challenge rating.
 * @enum {number}
 */
A5E.CR_EXP_LEVELS = {
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
  30: 155000
};

A5E.EQUIPPED_STATES = {
  NOT_CARRIED: 0,
  CARRIED: 1,
  EQUIPPED: 2
};

A5E.PREPARED_STATES = {
  UNPREPARED: 0,
  PREPARED: 1,
  ALWAYS_PREPARED: 2
};

A5E.ROLL_MODE = {
  NORMAL: 0,
  ADVANTAGE: 1,
  DISADVANTAGE: -1
};

/**
 * The set of ability scores used within the system.
 * @enum {string}
 */
A5E.abilities = {
  str: 'A5E.abilities.strength',
  dex: 'A5E.abilities.dexterity',
  con: 'A5E.abilities.constitution',
  int: 'A5E.abilities.intelligence',
  wis: 'A5E.abilities.wisdom',
  cha: 'A5E.abilities.charisma'
};

/**
 * Localized abbreviations for ability scores.
 * @enum {string}
 */
A5E.abilityAbbreviations = {
  str: 'A5E.abilities.abbreviations.strength',
  dex: 'A5E.abilities.abbreviations.dexterity',
  con: 'A5E.abilities.abbreviations.constitution',
  int: 'A5E.abilities.abbreviations.intelligence',
  wis: 'A5E.abilities.abbreviations.wisdom',
  cha: 'A5E.abilities.abbreviations.charisma'
};

/**
 * Localized abbreviations for activation costs.
 * @enum {string}
 */
A5E.abilityActivationTypes = {
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
  special: 'A5E.ActionActivationSpecial'
};

/**
 * Localized abbreviations for plural activation costs.
 * @enum {string}
 */
A5E.abilityActivationTypesPlural = {
  action: 'A5E.ActionActivationActionPlural',
  bonusAction: 'A5E.ActionActivationBonusActionPlural',
  hour: 'A5E.DurationHourPlural',
  lairAction: 'A5E.ActionActivationLairActionPlural',
  legendaryAction: 'A5E.ActionActivationLegendaryActionPlural',
  minute: 'A5E.DurationMinutePlural',
  none: 'A5E.ActionActivationNone',
  objectInteraction: 'A5E.ActionActivationObjectInteractionPlural',
  reaction: 'A5E.ActionActivationReaction',
  special: 'A5E.ActionActivationSpecial'
};

A5E.actionOptions = {
  abilityCheck: 'A5E.ActionOptionAbilityCheck',
  attack: 'A5E.ActionOptionAttack',
  damage: 'A5E.ActionOptionDamage',
  healing: 'A5E.ActionOptionHealing',
  savingThrow: 'A5E.ActionOptionSavingThrow'
};

/**
 * The set of possible creature sizes in the system.
 * @enum {string}
 */
A5E.actorSizes = {
  tiny: 'A5E.SizeTiny',
  sm: 'A5E.SizeSmall',
  med: 'A5E.SizeMedium',
  lg: 'A5E.SizeLarge',
  huge: 'A5E.SizeHuge',
  grg: 'A5E.SizeGargantuan',
  titan: 'A5E.SizeTitanic'
};

A5E.originItemTypes = [
  'background',
  'culture',
  'destiny',
  'heritage'
];

A5E.alignments = {
  chaotic: 'Chaotic',
  evil: 'Evil',
  good: 'Good',
  lawful: 'Lawful',
  neutral: 'Neutral'
};

A5E.ammunitionProperties = {
  explosive: 'A5E.AmmunitionPropertyExplosive',
  flaming: 'A5E.AmmunitionPropertyFlaming',
  punching: 'A5E.AmmunitionPropertyPunching'
};

A5E.appliedArmorTypes = {
  armor: 'A5E.armorClass.appliedArmorTypes.armor',
  underarmor: 'A5E.armorClass.appliedArmorTypes.underarmor'
};

A5E.areaIcons = {
  circle: '<i class="fa-regular fa-circle"></i>',
  cone: '<i class="fa-solid fa-wifi"></i>',
  cube: '<i class="fa-solid fa-cube"></i>',
  cylinder: '<i class="fa-solid fa-circle"></i>',
  emanation: '<i class="fa-regular fa-circle-dot"></i>',
  line: '<i class="fa-solid fa-grip-lines"></i>',
  sphere: '<i class="fa-solid fa-meteor"></i>',
  square: '<i class="fa-regular fa-square-full"></i>',
  wall: '<i class="fa-solid fa-road-spikes"></i>'
};

A5E.areaTypes = {
  circle: 'A5E.AreaCircle',
  cone: 'A5E.AreaCone',
  cube: 'A5E.AreaCube',
  cylinder: 'A5E.AreaCylinder',
  emanation: 'A5E.AreaEmanation',
  line: 'A5E.AreaLine',
  sphere: 'A5E.AreaSphere',
  square: 'A5E.AreaSquare',
  wall: 'A5E.AreaWall'
};

/**
 * Maps the area types to template shapes
 */
A5E.areaTemplates = {
  circle: 'circle',
  cone: 'cone',
  cube: 'rect',
  cylinder: 'circle',
  line: 'ray',
  sphere: 'circle',
  square: 'rect'
};

/**
 * The set of core armor types in the system.
 * @enum {string}
 */
A5E.armor = {
  light: 'A5E.ArmorLight',
  medium: 'A5E.ArmorMedium',
  heavy: 'A5E.ArmorHeavy',
  shield: 'A5E.ArmorShield'
};

A5E.ARMOR_MODES = {
  ADD: 1,
  OVERRIDE: 2
};

A5E.armorModes = {
  1: 'A5E.armorClass.modes.add',
  2: 'A5E.armorClass.modes.override'
};

/**
 * The set of core armor properties in the system.
 * @enum {string}
 */
A5E.armorProperties = {
  camouflaged: 'A5E.ArmorPropertyCamouflaged',
  spiked: 'A5E.ArmorPropertySpiked',
  stealthy: 'A5E.objectProperties.stealthy',
  storage: 'A5E.objectProperties.storage'
};

/**
 * The set of core armor types in the system in plural form.
 * @enum {string}
 */
A5E.armorPlural = {
  light: 'A5E.ArmorLight',
  medium: 'A5E.ArmorMedium',
  heavy: 'A5E.ArmorHeavy',
  shield: 'A5E.ArmorShieldPlural'
};

A5E.attackTypes = {
  meleeWeaponAttack: 'A5E.AttackTypeMeleeWeapon',
  rangedWeaponAttack: 'A5E.AttackTypeRangedWeapon',
  meleeSpellAttack: 'A5E.AttackTypeMeleeSpell',
  rangedSpellAttack: 'A5E.AttackTypeRangedSpell'
};

A5E.carryCapacityMultiplier = {
  tiny: 0.5,
  sm: 1,
  med: 1,
  lg: 2,
  huge: 4,
  grg: 8,
  titan: 16
};

/**
 *
 */
A5E.chatCardTypes = [
  'abilityCheck',
  'hitDice',
  'item',
  'rollTableOutput',
  'savingThrow',
  'skillCheck'
];

/**
 * The set of core conditions in the system.
 * @enum {string}
 */
A5E.conditions = {
  blinded: 'A5E.ConditionBlinded',
  bloodied: 'A5E.ConditionBloodied',
  charmed: 'A5E.ConditionCharmed',
  confused: 'A5E.ConditionConfused',
  deafened: 'A5E.ConditionDeafened',
  doomed: 'A5E.ConditionDoomed',
  encumbered: 'A5E.ConditionEncumbered',
  fatigue: 'A5E.ConditionFatigue',
  frightened: 'A5E.ConditionFrightened',
  grappled: 'A5E.ConditionGrappled',
  incapacitated: 'A5E.ConditionIncapacitated',
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
  unconscious: 'A5E.ConditionUnconscious'
};

/**
 * The default creature types.
 * @enum {string}
 */
A5E.creatureTypes = {
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
  undead: 'A5E.CreatureUndead'
};

A5E.damagedStates = {
  0: 'A5E.damagedState.intact',
  1: 'A5E.damagedState.damaged',
  2: 'A5E.damagedState.broken'
};

A5E.damageScalingModes = {
  cantrip: 'A5E.scaling.modes.cantrip',
  spellLevel: 'A5E.scaling.modes.spellLevel',
  spellPoints: 'A5E.scaling.modes.spellPoints',
  actionUses: 'A5E.scaling.modes.actionUses',
  itemUses: 'A5E.scaling.modes.itemUses'
};

A5E.healingScalingModes = {
  cantrip: 'A5E.scaling.modes.cantrip',
  spellLevel: 'A5E.scaling.modes.spellLevel',
  spellPoints: 'A5E.scaling.modes.spellPoints',
  actionUses: 'A5E.scaling.modes.actionUses',
  itemUses: 'A5E.scaling.modes.itemUses'
};

A5E.targetScalingModes = {
  cantrip: 'A5E.scaling.modes.cantrip',
  spellLevel: 'A5E.scaling.modes.spellLevel',
  spellPoints: 'A5E.scaling.modes.spellPoints',
  actionUses: 'A5E.scaling.modes.actionUses',
  itemUses: 'A5E.scaling.modes.itemUses'
};

/**
 * The set of core damage types in the system.
 * @enum {string}
 */
A5E.damageTypes = {
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
  thunder: 'A5E.damageTypes.thunder'
};

A5E.damageColors = {
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
  thunder: '#e2c269'
};

A5E.equippedStates = {
  0: 'A5E.equippedState.notCarried',
  1: 'A5E.equippedState.carried',
  2: 'A5E.equippedState.equipped'
};

A5E.expertiseDiceSidesMap = {
  0: 0,
  1: 4,
  2: 6,
  3: 8,
  4: 10,
  5: 12,
  6: 20
};

A5E.featureTypes = {
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
  other: 'A5E.FeatureOther'
};

/**
 * The set of core healing types in the system.
 * @enum {string}
 */
A5E.healingTypes = {
  healing: 'A5E.Healing',
  temporaryHealing: 'A5E.HealingTemporary'
};

A5E.healingColors = {
  healing: '#eeee9b',
  temporaryHealing: '#2fa6b1'
};

/**
 * List of various item rarities.
 * @enum {string}
 */
A5E.itemRarity = {
  mundane: 'A5E.itemRarities.mundane',
  common: 'A5E.itemRarities.common',
  uncommon: 'A5E.itemRarities.uncommon',
  rare: 'A5E.itemRarities.rare',
  veryRare: 'A5E.itemRarities.veryRare',
  legendary: 'A5E.itemRarities.legendary',
  artifact: 'A5E.itemRarities.artifact'
};

/**
 * List of various item types.
 * @enum {string}
 */
A5E.itemTypes = {
  background: 'TYPES.Item.background',
  culture: 'TYPES.Item.culture',
  destiny: 'TYPES.Item.destiny',
  feature: 'TYPES.Item.feature',
  maneuver: 'TYPES.Item.maneuver',
  object: 'TYPES.Item.object',
  spell: 'TYPES.Item.spell'
};

/**
 * List of Inventory Filters
 * @enum {string}
 */
A5E.inventoryFilters = {
  bulk: 'Bulk'
};

/**
 * Languages a character can learn.
 * @enum {string}
 */
A5E.languages = {
  abyssal: 'A5E.LanguagesAbyssal',
  aquan: 'A5E.LanguagesAquan',
  auran: 'A5E.LanguagesAuran',
  celestial: 'A5E.LanguagesCelestial',
  common: 'A5E.LanguagesCommon',
  deep: 'A5E.LanguagesDeepSpeech',
  draconic: 'A5E.LanguagesDraconic',
  druidic: 'A5E.LanguagesDruidic',
  dwarvish: 'A5E.LanguagesDwarvish',
  elvish: 'A5E.LanguagesElvish',
  giant: 'A5E.LanguagesGiant',
  gnoll: 'A5E.LanguagesGnoll',
  gnomish: 'A5E.LanguagesGnomish',
  goblin: 'A5E.LanguagesGoblin',
  grimlock: 'A5E.LanguagesGrimlock',
  halfling: 'A5E.LanguagesHalfling',
  ignan: 'A5E.LanguagesIgnan',
  infernal: 'A5E.LanguagesInfernal',
  minotaur: 'A5E.LanguagesMinotaur',
  mycelial: 'A5E.LanguagesMycelial',
  orc: 'A5E.LanguagesOrc',
  primordial: 'A5E.LanguagesPrimordial',
  sylvan: 'A5E.LanguagesSylvan',
  terran: 'A5E.LanguagesTerran',
  cant: 'A5E.LanguagesThievesCant',
  undercommon: 'A5E.LanguagesUndercommon'
};

A5E.maneuverDegrees = {
  0: 'A5E.ManeuverBasic',
  1: 'A5E.ManeuverDegree1',
  2: 'A5E.ManeuverDegree2',
  3: 'A5E.ManeuverDegree3',
  4: 'A5E.ManeuverDegree4',
  5: 'A5E.ManeuverDegree5'
};

A5E.maneuverTraditions = {
  adamantMountain: 'A5E.maneuverTraditions.adamantMountain',
  arcaneArtillery: 'A5E.maneuverTraditions.arcaneArtillery',
  arcaneKnight: 'A5E.maneuverTraditions.arcaneKnight',
  awakenedMind: 'A5E.maneuverTraditions.awakenedMind',
  beastUnity: 'A5E.maneuverTraditions.beastUnity',
  bitingZephyr: 'A5E.maneuverTraditions.bitingZephyr',
  comedicJabs: 'A5E.maneuverTraditions.comedicJabs',
  cuttingOmen: 'A5E.maneuverTraditions.cuttingOmen',
  eldritchBlackguard: 'A5E.maneuverTraditions.eldritchBlackguard',
  gallantHeart: 'A5E.maneuverTraditions.gallantHeart',
  grindingCog: 'A5E.maneuverTraditions.grindingCog',
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
  vipersFangs: 'A5E.maneuverTraditions.vipersFangs'
};

A5E.materialProperties = {
  comfortable: 'A5E.MaterialPropertyComfortable',
  feybane: 'A5E.MaterialPropertyFeybane',
  flaw: 'A5E.MaterialPropertyFlaw',
  fortified: 'A5E.MaterialPropertyFortified',
  hardy: 'A5E.MaterialPropertyHardy',
  highQuality: 'A5E.MaterialPropertyHighQuality',
  lightweight: 'A5E.MaterialPropertyLightweight',
  lowMaintenance: 'A5E.MaterialPropertyLowMaintenance',
  rust: 'A5E.MaterialPropertyRust',
  silvered: 'A5E.MaterialPropertySilvered',
  underarmor: 'A5E.MaterialPropertyUnderarmor',
  weighty: 'A5E.MaterialPropertyWeighty',
  wild: 'A5E.MaterialPropertyWild'
};

/**
 * The set of core movement types in the system.
 * @enum {string}
 */
A5E.movement = {
  walk: 'A5E.MovementWalkingSpeed',
  burrow: 'A5E.MovementBurrowingSpeed',
  climb: 'A5E.MovementClimbingSpeed',
  fly: 'A5E.MovementFlyingSpeed',
  swim: 'A5E.MovementSwimmingSpeed'
};

/**
 * The set of core movement types in the system.
 * @enum {string}
 */
A5E.movementAbbreviations = {
  walk: 'A5E.MovementWalkingSpeedAbbr',
  burrow: 'A5E.MovementBurrowingSpeedAbbr',
  climb: 'A5E.MovementClimbingSpeedAbbr',
  fly: 'A5E.MovementFlyingSpeedAbbr',
  swim: 'A5E.MovementSwimmingSpeedAbbr'
};

/**
 * @enum {string}
 */
A5E.distanceUnits = {
  feet: 'A5E.DistanceUnitFeet',
  miles: 'A5E.DistanceUnitMiles',
  meters: 'A5E.DistanceUnitMeters',
  kilometers: 'A5E.DistanceUnitKilometers'
};

A5E.distanceAbbreviations = {
  feet: 'A5E.DistanceFeetAbbr',
  miles: 'A5E.DistanceMilesAbbr',
  meters: 'A5E.DistanceMetersAbbr',
  kilometers: 'A5E.DistanceKilometersAbbr'
};

A5E.visionUnits = {
  ...A5E.distanceUnits,
  unlimited: 'A5E.RangeUnlimited'
};

/**
 * The set of object subtypes available within the system.
 * @enum {string}
 */
A5E.objectTypes = {
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
  weapon: 'A5E.ObjectTypeWeapon'
};

/**
 * The set of object subtypes available within the system.
 * @enum {string}
 */
A5E.objectTypesPlural = {
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
  weapon: 'A5E.ObjectTypeWeaponPlural'
};

A5E.preparedStates = {
  0: 'A5E.preparedState.unprepared',
  1: 'A5E.preparedState.prepared',
  2: 'A5E.preparedState.alwaysPrepared'
};

/**
 * The set of core range types in the system.
 * @enum {string}
 */
A5E.rangeDescriptors = {
  self: 'A5E.RangeSelf',
  touch: 'A5E.RangeTouch',
  fiveFeet: 'A5E.RangeFiveFeet',
  short: 'A5E.RangeShort',
  medium: 'A5E.RangeMedium',
  long: 'A5E.RangeLong',
  other: 'A5E.RangeOther'
};

A5E.rangeValues = {
  self: 'A5E.RangeSelf',
  touch: 'A5E.RangeTouch',
  fiveFeet: 5,
  short: 30,
  medium: 60,
  long: 120
};

A5E.resourceRecoveryOptions = {
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
  year: 'A5E.DurationYear'
};

A5E.rollModes = {
  normal: 'A5E.RollModeNormal',
  advantage: 'A5E.RollModeAdvantage',
  disadvantage: 'A5E.RollModeDisadvantage'
};

// TODO: Add localizations for these roll types.
A5E.rollTypes = {
  abilityCheck: 'Ability Check',
  attack: 'Attack',
  damage: 'Damage',
  healing: 'Healing',
  generic: 'Generic',
  savingThrow: 'Saving Throw',
  skillCheck: 'Skill Check',
  toolCheck: 'ToolCheck'
};

A5E.saveDCOptions = {
  spellcasting: 'A5E.SpellDC',
  maneuver: 'A5E.ManeuverDC',
  ...A5E.abilities,
  custom: 'A5E.Custom'
};

/**
 * The set of core special sense types in the system.
 * @enum {string}
 */
A5E.senses = {
  blindsight: 'A5E.SenseBlindsight',
  darkvision: 'A5E.SenseDarkvision',
  tremorsense: 'A5E.SenseTremorsense',
  truesight: 'A5E.SenseTruesight'
};

A5E.scrollData = {
  0: {
    attackBonus: 5,
    cost: '10 gp',
    craftingComponent: 'Magical inks',
    saveDC: 13,
    rarity: 'common'
  },
  1: {
    attackBonus: 5,
    cost: '25 gp',
    craftingComponent: 'Magical inks',
    saveDC: 13,
    rarity: 'common'
  },
  2: {
    attackBonus: 5,
    cost: '75 gp',
    craftingComponent: 'Magical inks',
    saveDC: 13,
    rarity: 'common'
  },
  3: {
    attackBonus: 7,
    cost: '175 gp',
    craftingComponent: 'Dire wolf hide',
    saveDC: 15,
    rarity: 'uncommon'
  },
  4: {
    attackBonus: 7,
    cost: '500 gp',
    craftingComponent: 'Dire wolf hide',
    saveDC: 15,
    rarity: 'uncommon'
  },
  5: {
    attackBonus: 9,
    cost: '1250 gp',
    craftingComponent: 'Parchment infused with planar energy',
    saveDC: 17,
    rarity: 'rare'
  },
  6: {
    attackBonus: 9,
    cost: '3000 gp',
    craftingComponent: 'Parchment infused with planar energy',
    saveDC: 17,
    rarity: 'rare'
  },
  7: {
    attackBonus: 10,
    cost: '8000 gp',
    craftingComponent: 'Blank pages from a lich\'s spellbook',
    saveDC: 18,
    rarity: 'veryRare'
  },
  8: {
    attackBonus: 10,
    cost: '20000 gp',
    craftingComponent: 'Blank pages from a lich\'s spellbook',
    saveDC: 18,
    rarity: 'veryRare'
  },
  9: {
    attackBonus: 11,
    cost: '55000 gp',
    craftingComponent: 'Parchment made from a dragon\'s hide',
    saveDC: 19,
    rarity: 'legendary'
  }
};

A5E.shieldProperties = {
  handsFree: 'A5E.shieldProperties.handsFree',
  mirrored: 'A5E.shieldProperties.mirrored',
  spikes: 'A5E.shieldProperties.spikes'
};

/**
 * The set of core shield types in the system.
 * @enum {string}
 */
A5E.shieldTypes = {
  light: 'A5E.ShieldTypeLight',
  medium: 'A5E.ShieldTypeMedium',
  heavy: 'A5E.ShieldTypeHeavy',
  tower: 'A5E.ShieldTypeTower'
};

A5E.shieldBaseACBonus = {
  light: 1,
  medium: 2,
  heavy: 2,
  tower: 2
};

A5E.spellComponents = {
  vocalized: 'A5E.SpellComponentVocalized',
  seen: 'A5E.SpellComponentSeen',
  material: 'A5E.SpellComponentMaterial'
};

A5E.spellComponentAbbreviations = {
  vocalized: 'A5E.SpellComponentVocalizedAbbr',
  seen: 'A5E.SpellComponentSeenAbbr',
  material: 'A5E.SpellComponentMaterialAbbr'
};

/**
 * Valid spell levels.
 * @enum {string}
 */
A5E.spellLevels = {
  0: 'A5E.SpellLevel0',
  1: 'A5E.SpellLevel1',
  2: 'A5E.SpellLevel2',
  3: 'A5E.SpellLevel3',
  4: 'A5E.SpellLevel4',
  5: 'A5E.SpellLevel5',
  6: 'A5E.SpellLevel6',
  7: 'A5E.SpellLevel7',
  8: 'A5E.SpellLevel8',
  9: 'A5E.SpellLevel9'
};

A5E.spellLevelCost = {
  0: 0,
  1: 2,
  2: 3,
  3: 5,
  4: 6,
  5: 7,
  6: 9,
  7: 10,
  8: 11,
  9: 13
};

A5E.spellSchools = {
  primary: {
    abjuration: 'A5E.SpellSchoolAbjuration',
    conjuration: 'A5E.SpellSchoolConjuration',
    divination: 'A5E.SpellSchoolDivination',
    enchantment: 'A5E.SpellSchoolEnchantment',
    evocation: 'A5E.SpellSchoolEvocation',
    illusion: 'A5E.SpellSchoolIllusion',
    necromancy: 'A5E.SpellSchoolNecromancy',
    transmutation: 'A5E.SpellSchoolTransmutation'
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
    weather: 'A5E.SpellSchoolWeather'
  }
};

/**
 * The set of core skills used in the system.
 * @enum {string}
 */
A5E.skills = {
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
  slt: 'A5E.skills.sleightOfHand',
  ste: 'A5E.skills.stealth',
  sur: 'A5E.skills.survival'
};

A5E.skillCriticalTables = {
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
  sur: 'Compendium.a5e.a5e-roll-tables.RollTable.27u8uhi0v7x4dxwz'
};

A5E.skillFumbleTables = {
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
  sur: 'Compendium.a5e.a5e-roll-tables.RollTable.jbjp515vtjmolbng'
};

A5E.skillDefaultAbilities = {
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
  slt: 'dex',
  ste: 'dex',
  sur: 'wis'
};

/**
 * The set of core skill specialties used in the system.
 */
A5E.skillSpecialties = {
  acr: {
    balancing: 'A5E.skillSpecialties.balancing',
    escapeArtistry: 'A5E.skillSpecialties.escapeArtistry',
    swinging: 'A5E.skillSpecialties.swinging',
    tumbling: 'A5E.skillSpecialties.tumbling'
  },
  ani: {
    calming: 'A5E.skillSpecialties.calming',
    driving: 'A5E.skillSpecialties.driving',
    farming: 'A5E.skillSpecialties.farming',
    riding: 'A5E.skillSpecialties.riding',
    training: 'A5E.skillSpecialties.training'
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
    thePlanes: 'A5E.skillSpecialties.thePlanes'
  },
  ath: {
    climbing: 'A5E.skillSpecialties.climbing',
    jumping: 'A5E.skillSpecialties.jumping',
    lifting: 'A5E.skillSpecialties.lifting',
    martialArts: 'A5E.skillSpecialties.martialArts',
    running: 'A5E.skillSpecialties.running',
    swimming: 'A5E.skillSpecialties.swimming',
    throwing: 'A5E.skillSpecialties.throwing'
  },
  cul: {
    courtlyManners: 'A5E.skillSpecialties.courtlyManners',
    cuisine: 'A5E.skillSpecialties.cuisine',
    etiquette: 'A5E.skillSpecialties.etiquette',
    laws: 'A5E.skillSpecialties.laws',
    linguistics: 'A5E.skillSpecialties.linguistics',
    regionalGoods: 'A5E.skillSpecialties.regionalGoods',
    streetwise: 'A5E.skillSpecialties.streetwise',
    trade: 'A5E.skillSpecialties.trade'
  },
  dec: {
    boasting: 'A5E.skillSpecialties.boasting',
    ciphers: 'A5E.skillSpecialties.ciphers',
    concealingEmotions: 'A5E.skillSpecialties.concealingEmotions',
    liesOfOmission: 'A5E.skillSpecialties.liesOfOmission',
    mimicry: 'A5E.skillSpecialties.mimicry'
  },
  eng: {
    architecture: 'A5E.skillSpecialties.architecture',
    chemistry: 'A5E.skillSpecialties.chemistry',
    explosives: 'A5E.skillSpecialties.explosives',
    gadgetry: 'A5E.skillSpecialties.gadgetry',
    mathematics: 'A5E.skillSpecialties.mathematics',
    mechanicalTraps: 'A5E.skillSpecialties.mechanicalTraps',
    plumbing: 'A5E.skillSpecialties.plumbing',
    siegecraft: 'A5E.skillSpecialties.siegecraft'
  },
  his: {
    arts: 'A5E.skillSpecialties.arts',
    empires: 'A5E.skillSpecialties.empires',
    genealogy: 'A5E.skillSpecialties.genealogy',
    legends: 'A5E.skillSpecialties.legends',
    wars: 'A5E.skillSpecialties.wars'
  },
  ins: {
    detectingLies: 'A5E.skillSpecialties.detectingLies',
    readingEmotions: 'A5E.skillSpecialties.readingEmotions',
    sensingMotives: 'A5E.skillSpecialties.sensingMotives'
  },
  itm: {
    authority: 'A5E.skillSpecialties.authority',
    ferocity: 'A5E.skillSpecialties.ferocity',
    interrogation: 'A5E.skillSpecialties.interrogation',
    subtleThreats: 'A5E.skillSpecialties.subtleThreats',
    weaponDisplays: 'A5E.skillSpecialties.weaponDisplays'
  },
  inv: {
    appraisal: 'A5E.skillSpecialties.appraisal',
    deciphering: 'A5E.skillSpecialties.deciphering',
    forensics: 'A5E.skillSpecialties.forensics',
    gatheringRumors: 'A5E.skillSpecialties.gatheringRumors',
    research: 'A5E.skillSpecialties.research',
    trapfinding: 'A5E.skillSpecialties.trapfinding'
  },
  med: {
    animals: 'A5E.skillSpecialties.animals',
    autopsy: 'A5E.skillSpecialties.autopsy',
    diseases: 'A5E.skillSpecialties.diseases',
    drugs: 'A5E.skillSpecialties.drugs',
    herbalism: 'A5E.skillSpecialties.herbalism',
    mentalHealth: 'A5E.skillSpecialties.mentalHealth',
    poisons: 'A5E.skillSpecialties.poisons'
  },
  nat: {
    astronomy: 'A5E.skillSpecialties.astronomy',
    beastLore: 'A5E.skillSpecialties.beastLore',
    farming: 'A5E.skillSpecialties.farming',
    fey: 'A5E.skillSpecialties.fey',
    plantLore: 'A5E.skillSpecialties.plantLore',
    weather: 'A5E.skillSpecialties.weather'
  },
  prc: {
    farsight: 'A5E.skillSpecialties.farsight',
    invisibleObjects: 'A5E.skillSpecialties.invisibleObjects',
    listening: 'A5E.skillSpecialties.listening',
    scent: 'A5E.skillSpecialties.scent'
  },
  prf: {
    acting: 'A5E.skillSpecialties.acting',
    composing: 'A5E.skillSpecialties.composing',
    dancing: 'A5E.skillSpecialties.dancing',
    fineArt: 'A5E.skillSpecialties.fineArt',
    singing: 'A5E.skillSpecialties.singing',
    speaking: 'A5E.skillSpecialties.speaking',
    writing: 'A5E.skillSpecialties.writing'
  },
  per: {
    bribery: 'A5E.skillSpecialties.bribery',
    flattery: 'A5E.skillSpecialties.flattery',
    leadership: 'A5E.skillSpecialties.leadership',
    negotiation: 'A5E.skillSpecialties.negotiation',
    peacemaking: 'A5E.skillSpecialties.peacemaking'
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
    undead: 'A5E.skillSpecialties.undead'
  },
  slt: {
    distraction: 'A5E.skillSpecialties.distraction',
    legerdemain: 'A5E.skillSpecialties.legerdemain',
    pickpocketing: 'A5E.skillSpecialties.pickpocketing'
  },
  ste: {
    anonymity: 'A5E.skillSpecialties.anonymity',
    camouflage: 'A5E.skillSpecialties.camouflage',
    casing: 'A5E.skillSpecialties.casing'
  },
  sur: {
    dungeoneering: 'A5E.skillSpecialties.dungeoneering',
    foraging: 'A5E.skillSpecialties.foraging',
    hunting: 'A5E.skillSpecialties.hunting',
    tracking: 'A5E.skillSpecialties.tracking',
    wayfinding: 'A5E.skillSpecialties.wayfinding'
  }
};

A5E.targetTypes = {
  self: 'A5E.TargetSelf',
  creature: 'A5E.TargetCreature',
  object: 'A5E.TargetObject',
  creatureObject: 'A5E.TargetCreatureObject',
  other: 'A5E.TargetOther'
};

A5E.targetTypesPlural = {
  self: 'A5E.TargetSelf',
  creature: 'A5E.TargetCreaturePlural',
  object: 'A5E.TargetObjectPlural',
  creatureObject: 'A5E.TargetCreatureObjectPlural',
  other: 'A5E.TargetOther'
};

A5E.terrainTypes = {
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
  water: 'A5E.terrainTypes.water'
};

A5E.timePeriods = {
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
  special: 'A5E.DurationSpecial'
};

A5E.timePeriodsPlural = {
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
  special: 'A5E.DurationSpecial'
};

A5E.tokenDimensions = {
  tiny: 0.5,
  sm: 1,
  med: 1,
  lg: 2,
  huge: 3,
  grg: 4,
  titan: 5
};

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars.
 * @enum {number}
 */
A5E.tokenHPColors = {
  damage: 0xFF0000,
  healing: 0x00FF00,
  temp: 0x66CCFF
};

A5E.toolCategories = {
  artisansTools: 'A5E.ToolsArtisanTools',
  gamingSets: 'A5E.ToolsGamingSets',
  musicalInstruments: 'A5E.MusicalInstruments',
  miscellaneous: 'A5E.ToolsMiscellaneous',
  vehicles: 'A5E.ToolsVehicles',
  other: 'A5E.ToolsOther'
};

A5E.tools = {
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
    woodcarversTools: 'A5E.ToolWoodcarversTools'
  },
  gamingSets: {
    diceSet: 'A5E.ToolDiceSet',
    boardGameSet: 'A5E.ToolBoardGameSet',
    playingCardSet: 'A5E.ToolPlayingCardSet'
  },
  musicalInstruments: {
    bagpipes: 'A5E.InstrumentBagpipes',
    casaba: 'A5E.InstrumentCasaba',
    castanet: 'A5E.InstrumentCastanet',
    drum: 'A5E.InstrumentDrum',
    dulcimer: 'A5E.InstrumentDulcimer',
    flute: 'A5E.InstrumentFlute',
    harp: 'A5E.InstrumentHarp',
    horn: 'A5E.InstrumentHorn',
    lute: 'A5E.InstrumentLute',
    lyre: 'A5E.InstrumentLyre',
    maraca: 'A5E.InstrumentMaraca',
    ocarina: 'A5E.InstrumentOcarina',
    panFlute: 'A5E.InstrumentPanFlute',
    trombone: 'A5E.InstrumentTrombone',
    violin: 'A5E.InstrumentViolin'
  },
  miscellaneous: {
    disguiseKit: 'A5E.ToolDisguiseKit',
    forgeryKit: 'A5E.ToolForgeryKit',
    herbalismKit: 'A5E.ToolHerbalismKit',
    navigatorsTools: 'A5E.ToolNavigatorsTools',
    poisonersKit: 'A5E.ToolPoisonersKit',
    sewingKit: 'A5E.ToolSewingKit',
    smithsTools: 'A5E.ToolSmithsTools',
    thievesTools: 'A5E.ToolThievesTools'
  },
  vehicles: {
    landVehicles: 'A5E.VehicleLand',
    waterVehicles: 'A5E.VehicleWater',
    airVehicles: 'A5E.VehicleAir'
  }
};

A5E.toolsPlural = {
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
    woodcarversTools: 'A5E.ToolWoodcarversTools'
  },
  gamingSets: {
    diceSet: 'A5E.ToolDiceSetPlural',
    boardGameSet: 'A5E.ToolBoardGameSetPlural',
    playingCardSet: 'A5E.ToolPlayingCardSetPlural'
  },
  musicalInstruments: {
    bagpipes: 'A5E.InstrumentBagpipesPlural',
    casaba: 'A5E.InstrumentCasabaPlural',
    castanet: 'A5E.InstrumentCastanetPlural',
    drum: 'A5E.InstrumentDrumPlural',
    dulcimer: 'A5E.InstrumentDulcimerPlural',
    flute: 'A5E.InstrumentFlutePlural',
    harp: 'A5E.InstrumentHarpPlural',
    horn: 'A5E.InstrumentHornPlural',
    lute: 'A5E.InstrumentLutePlural',
    lyre: 'A5E.InstrumentLyrePlural',
    maraca: 'A5E.InstrumentMaracaPlural',
    ocarina: 'A5E.InstrumentOcarinaPlural',
    panFlute: 'A5E.InstrumentPanFlutePlural',
    trombone: 'A5E.InstrumentTrombonePlural',
    violin: 'A5E.InstrumentViolinPlural'
  },
  miscellaneous: {
    disguiseKit: 'A5E.ToolDisguiseKitPlural',
    forgeryKit: 'A5E.ToolForgeryKitPlural',
    herbalismKit: 'A5E.ToolHerbalismKitPlural',
    navigatorsTools: 'A5E.ToolNavigatorsToolsPlural',
    poisonersKit: 'A5E.ToolPoisonersKitPlural',
    sewingKit: 'A5E.ToolSewingKitPlural',
    smithsTools: 'A5E.ToolSmithsToolsPlural',
    thievesTools: 'A5E.ToolThievesToolsPlural'
  },
  vehicles: {
    landVehicles: 'A5E.VehicleLandPlural',
    waterVehicles: 'A5E.VehicleWaterPlural',
    airVehicles: 'A5E.VehicleAirPlural'
  }
};

A5E.weaponCategories = {
  simple: 'A5E.WeaponsSimple',
  martial: 'A5E.WeaponsMartial',
  rare: 'A5E.WeaponsRare',
  other: 'A5E.WeaponsOther'
};

/**
 * The set of core weapons used in the system.
 */
A5E.weapons = {
  simple: {
    blowgun: 'A5E.WeaponBlowgun',
    club: 'A5E.WeaponClub',
    dagger: 'A5E.WeaponDagger',
    handaxe: 'A5E.WeaponHandaxe',
    heavyCrossbow: 'A5E.WeaponHeavyCrossbow',
    greatclub: 'A5E.WeaponGreatclub',
    lightCrossbow: 'A5E.WeaponLightCrossbow',
    mace: 'A5E.WeaponMace',
    quarterstaff: 'A5E.WeaponQuarterstaff',
    sickle: 'A5E.WeaponSickle',
    sling: 'A5E.WeaponSling',
    spear: 'A5E.WeaponSpear'
  },
  martial: {
    bastardSword: 'A5E.WeaponBastardSword',
    battleaxe: 'A5E.WeaponBattleaxe',
    brassKnuckles: 'A5E.WeaponBrassKnuckles',
    compositeBow: 'A5E.WeaponCompositeBow',
    dart: 'A5E.WeaponDart',
    duelingDagger: 'A5E.WeaponDuelingDagger',
    flail: 'A5E.WeaponFlail',
    garotte: 'A5E.WeaponGarotte',
    glaive: 'A5E.WeaponGlaive',
    greataxe: 'A5E.WeaponGreataxe',
    greatsword: 'A5E.WeaponGreatsword',
    halberd: 'A5E.WeaponHalberd',
    handCrossbow: 'A5E.WeaponHandCrossbow',
    javelin: 'A5E.WeaponJavelin',
    lance: 'A5E.WeaponLance',
    lightHammer: 'A5E.WeaponLightHammer',
    longbow: 'A5E.WeaponLongbow',
    longsword: 'A5E.WeaponLongsword',
    maul: 'A5E.WeaponMaul',
    morningstar: 'A5E.WeaponMorningstar',
    net: 'A5E.WeaponNet',
    pike: 'A5E.WeaponPike',
    punchingDagger: 'A5E.WeaponPunchingDagger',
    rapier: 'A5E.WeaponRapier',
    saber: 'A5E.WeaponSaber',
    scimitar: 'A5E.WeaponScimitar',
    scythe: 'A5E.WeaponScythe',
    shortbow: 'A5E.WeaponShortbow',
    shortsword: 'A5E.WeaponShortsword',
    spearThrower: 'A5E.WeaponSpearThrower',
    throwingDagger: 'A5E.WeaponThrowingDagger',
    trident: 'A5E.WeaponTrident',
    warhammer: 'A5E.WeaponWarhammer',
    warPick: 'A5E.WeaponWarPick',
    whip: 'A5E.WeaponWhip'
  },
  rare: {
    assassinsGauntlet: 'A5E.WeaponAssassinsGauntlet',
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
    swordPistol: 'A5E.WeaponSwordPistol'
  }
};

/**
 * The set of core weapons used in the system in their plural form.
 */
A5E.weaponsPlural = {
  simple: {
    blowgun: 'A5E.WeaponBlowgunPlural',
    club: 'A5E.WeaponClubPlural',
    dagger: 'A5E.WeaponDaggerPlural',
    handaxe: 'A5E.WeaponHandaxePlural',
    heavyCrossbow: 'A5E.WeaponHeavyCrossbowPlural',
    greatclub: 'A5E.WeaponGreatclubPlural',
    lightCrossbow: 'A5E.WeaponLightCrossbowPlural',
    mace: 'A5E.WeaponMacePlural',
    quarterstaff: 'A5E.WeaponQuarterstaffPlural',
    sickle: 'A5E.WeaponSicklePlural',
    sling: 'A5E.WeaponSlingPlural',
    spear: 'A5E.WeaponSpearPlural'
  },
  martial: {
    bastardSword: 'A5E.WeaponBastardSwordPlural',
    battleaxe: 'A5E.WeaponBattleaxePlural',
    brassKnuckles: 'A5E.WeaponBrassKnucklesPlural',
    compositeBow: 'A5E.WeaponCompositeBowPlural',
    dart: 'A5E.WeaponDartPlural',
    duelingDagger: 'A5E.WeaponDuelingDaggerPlural',
    flail: 'A5E.WeaponFlailPlural',
    garotte: 'A5E.WeaponGarottePlural',
    glaive: 'A5E.WeaponGlaivePlural',
    greataxe: 'A5E.WeaponGreataxePlural',
    greatsword: 'A5E.WeaponGreatswordPlural',
    halberd: 'A5E.WeaponHalberdPlural',
    handCrossbow: 'A5E.WeaponHandCrossbowPlural',
    javelin: 'A5E.WeaponJavelinPlural',
    lance: 'A5E.WeaponLancePlural',
    lightHammer: 'A5E.WeaponLightHammerPlural',
    longbow: 'A5E.WeaponLongbowPlural',
    longsword: 'A5E.WeaponLongswordPlural',
    maul: 'A5E.WeaponMaulPlural',
    morningstar: 'A5E.WeaponMorningstarPlural',
    net: 'A5E.WeaponNetPlural',
    pike: 'A5E.WeaponPikePlural',
    punchingDagger: 'A5E.WeaponPunchingDaggerPlural',
    rapier: 'A5E.WeaponRapierPlural',
    saber: 'A5E.WeaponSaberPlural',
    scimitar: 'A5E.WeaponScimitarPlural',
    scythe: 'A5E.WeaponScythePlural',
    shortbow: 'A5E.WeaponShortbowPlural',
    shortsword: 'A5E.WeaponShortswordPlural',
    spearThrower: 'A5E.WeaponSpearThrowerPlural',
    throwingDagger: 'A5E.WeaponThrowingDaggerPlural',
    trident: 'A5E.WeaponTridentPlural',
    warhammer: 'A5E.WeaponWarhammerPlural',
    warPick: 'A5E.WeaponWarPickPlural',
    whip: 'A5E.WeaponWhipPlural'
  },
  rare: {
    assassinsGauntlet: 'A5E.WeaponAssassinsGauntletPlural',
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
    swordPistol: 'A5E.WeaponSwordPistolPlural'
  }
};

/**
 * The set of core weapon propeties used in the system.
 * @enum {string}
 */
A5E.weaponProperties = {
  burn: 'A5E.weaponProperties.burn',
  breaker: 'A5E.weaponProperties.breaker',
  breakerStone: 'A5E.weaponProperties.breakerStone',
  breakerWood: 'A5E.weaponProperties.breakerWood',
  compounding: 'A5E.weaponProperties.compounding',
  defensive: 'A5E.weaponProperties.defensive',
  defensiveLight: 'A5E.weaponProperties.defensiveLight',
  defensiveMedium: 'A5E.weaponProperties.defensiveMedium',
  defensiveHeavy: 'A5E.weaponProperties.defensiveHeavy',
  dualWielding: 'A5E.weaponProperties.dualWielding',
  finesse: 'A5E.weaponProperties.finesse',
  flamboyant: 'A5E.weaponProperties.flamboyant',
  handMounted: 'A5E.weaponProperties.handMounted',
  heavy: 'A5E.weaponProperties.heavy',
  inaccurate: 'A5E.weaponProperties.inaccurate',
  loading: 'A5E.weaponProperties.loading',
  mounted: 'A5E.weaponProperties.mounted',
  muzzleLoading: 'A5E.weaponProperties.muzzleLoading',
  parrying: 'A5E.weaponProperties.parrying',
  parryingImmunity: 'A5E.weaponProperties.parryingImmunity',
  quickdraw: 'A5E.weaponProperties.quickdraw',
  range: 'A5E.weaponProperties.range',
  rebounding: 'A5E.objectProperties.rebounding',
  reach: 'A5E.weaponProperties.reach',
  rifled: 'A5E.weaponProperties.rifled',
  scatter: 'A5E.weaponProperties.scatter',
  shock: 'A5E.weaponProperties.shock',
  simple: 'A5E.weaponProperties.simple',
  stealthy: 'A5E.objectProperties.stealthy',
  storage: 'A5E.objectProperties.storage',
  thrown: 'A5E.weaponProperties.thrown',
  triggerCharge: 'A5E.weaponProperties.triggerCharge',
  trip: 'A5E.weaponProperties.trip',
  twoHanded: 'A5E.weaponProperties.twoHanded',
  versatile: 'A5E.weaponProperties.versatile',
  vicious: 'A5E.weaponProperties.vicious'
};

// Build Complex Config Parts
// These are purposefully done first
registerDocumentConfig(A5E);
registerContextsConfig(A5E);
registerGrantsConfig(A5E);

registerActiveEffectConfig(A5E);
registerBonusesConfig(A5E);
registerCharacterClassesConfig(A5E);
registerConsumerConfig(A5E);
registerFilterConfig(A5E);
registerEncounterElements(A5E);
registerEffectGroupConfig(A5E);
registerEffectLocalizationConfig(A5E);
registerModuleIncompatibilities(A5E);
registerPremiumContentConfig(A5E);
registerPublisherConfig(A5E);
registerReducerConfig(A5E);
registerSettingsConfig(A5E);

registerPreLocalizationProperties(A5E);

export default A5E;
