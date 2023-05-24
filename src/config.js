const A5E = {};

A5E.ROLL_MODE = {
  NORMAL: 0,
  ADVANTAGE: 1,
  DISADVANTAGE: -1
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

A5E.activeEffectTypes = {
  ongoing: 'A5E.effects.type.ongoing',
  inactive: 'A5E.effects.type.inactive',
  passive: 'A5E.effects.type.passive',
  temporary: 'A5E.effects.type.temporary'
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

A5E.ammunitionProperties = {
  explosive: 'A5E.AmmunitionPropertyExplosive',
  flaming: 'A5E.AmmunitionPropertyFlaming',
  punching: 'A5E.AmmunitionPropertyPunching'
};

A5E.areaIcons = {
  circle: '<i class="fa-regular fa-circle"></i>',
  cone: '<i class="fa-solid fa-wifi"></i>',
  cube: '<i class="fa-solid fa-cube"></i>',
  cylinder: '<i class="fa-solid fa-circle"></i>',
  line: '<i class="fa-solid fa-grip-lines"></i>',
  sphere: '<i class="fa-solid fa-meteor"></i>',
  square: '<i class="fa-regular fa-square-full"></i>'
};

A5E.areaTypes = {
  circle: 'A5E.AreaCircle',
  cone: 'A5E.AreaCone',
  cube: 'A5E.AreaCube',
  cylinder: 'A5E.AreaCylinder',
  line: 'A5E.AreaLine',
  sphere: 'A5E.AreaSphere',
  square: 'A5E.AreaSquare'
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

/**
 * The set of core armor properties in the system.
 * @enum {string}
 */
A5E.armorProperties = {
  camouflaged: 'A5E.ArmorPropertyCamouflaged',
  spiked: 'A5E.ArmorPropertySpiked',
  stealthy: 'A5E.ObjectPropertyStealthy',
  storage: 'A5E.ObjectPropertyStorage'
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

A5E.configurableConsumers = new Set([
  'actionUses', 'itemUses', 'hitDice', 'spell'
]);

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

A5E.damageBonusContexts = {
  all: 'A5E.damageBonuses.contexts.all',
  meleeWeaponAttacks: 'A5E.damageBonuses.contexts.meleeWeaponAttacks',
  meleeSpellAttacks: 'A5E.damageBonuses.contexts.meleeSpellAttacks',
  rangedWeaponAttacks: 'A5E.damageBonuses.contexts.rangedWeaponAttacks',
  rangedSpellAttacks: 'A5E.damageBonuses.contexts.rangedSpellAttacks',
  spellAttacks: 'A5E.damageBonuses.contexts.spellAttacks',
  weaponAttacks: 'A5E.damageBonuses.contexts.weaponAttacks'
};

A5E.damageBonusSummariesByContext = {
  all: 'A5E.damageBonuses.summaries.contexts.all',
  meleeWeaponAttacks: 'A5E.damageBonuses.summaries.contexts.meleeWeaponAttacks',
  meleeSpellAttacks: 'A5E.damageBonuses.summaries.contexts.meleeSpellAttacks',
  rangedWeaponAttacks: 'A5E.damageBonuses.summaries.contexts.rangedWeaponAttacks',
  rangedSpellAttacks: 'A5E.damageBonuses.summaries.contexts.rangedSpellAttacks',
  spellAttacks: 'A5E.damageBonuses.summaries.contexts.spellAttacks',
  weaponAttacks: 'A5E.damageBonuses.summaries.contexts.weaponAttacks'
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

/**
 * List of various item rarities.
 * @enum {string}
 */
A5E.itemRarity = {
  common: 'A5E.ItemRarityCommon',
  uncommon: 'A5E.ItemRarityUncommon',
  rare: 'A5E.ItemRarityRare',
  veryRare: 'A5E.ItemRarityVeryRare',
  legendary: 'A5E.ItemRarityLegendary',
  artifact: 'A5E.ItemRarityArtifact'
};

/**
 * List of various item types.
 * @enum {string}
 */
A5E.itemTypes = {
  background: 'ITEM.TypeBackground',
  culture: 'ITEM.TypeCulture',
  destiny: 'ITEM.TypeDestiny',
  feature: 'ITEM.TypeFeature',
  maneuver: 'ITEM.TypeManeuver',
  object: 'ITEM.TypeObject',
  spell: 'ITEM.TypeSpell'
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
  gnomish: 'A5E.LanguagesGnomish',
  goblin: 'A5E.LanguagesGoblin',
  halfling: 'A5E.LanguagesHalfling',
  ignan: 'A5E.LanguagesIgnan',
  infernal: 'A5E.LanguagesInfernal',
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
  cuttingOmen: 'A5E.maneuverTraditions.cuttingOmen',
  eldritchBlackguard: 'A5E.maneuverTraditions.eldritchBlackguard',
  mirrorsGlint: 'A5E.maneuverTraditions.mirrorsGlint',
  mistAndShade: 'A5E.maneuverTraditions.mistAndShade',
  rapidCurrent: 'A5E.maneuverTraditions.rapidCurrent',
  razorsEdge: 'A5E.maneuverTraditions.razorsEdge',
  sanguineKnot: 'A5E.maneuverTraditions.sanguineKnot',
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
  jewelry: 'A5E.ObjectTypeJewelry',
  miscellaneous: 'A5E.ObjectTypeMiscellaneous',
  shield: 'A5E.ObjectTypeShieldPlural',
  tool: 'A5E.ObjectTypeToolPlural',
  weapon: 'A5E.ObjectTypeWeaponPlural'
};

A5E.publishers = {
  acesAdventuringGuides: {
    name: "Ace's Adventuring Guides",
    logo: ''
  },
  anthonyAlipio: {
    name: 'Anthony Alipio',
    logo: ''
  },
  dmSarah: {
    name: 'DM Sarah',
    logo: ''
  },
  joshGentry: {
    name: 'Josh Gentry',
    logo: ''
  },
  purpleMartinGames: {
    name: 'Purple Martin Games',
    logo: 'systems/a5e/assets/publisherLogos/purple-martin-games-logo.webp'
  },
  ravine: {
    name: 'Ravine',
    logo: 'icons/svg/book.svg'
  },
  rollThemBones: {
    name: 'Roll them Bones Gaming',
    logo: 'systems/a5e/assets/publisherLogos/roll-them-bones-gaming-logo.webp'
  },
  steampunkette: {
    name: 'Steampunkette',
    logo: ''
  },
  wolfworksPress: {
    name: 'Wolfworks Press',
    logo: ''
  }
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

A5E.resourceConsumerConfig = {
  exertion: { path: 'attributes.exertion.current', label: 'A5E.Exertion', type: 'value' },
  hp: { path: 'attributes.hp.value', label: 'A5E.HitPoints', type: 'value' },
  inspiration: { path: 'attributes.inspiration', label: 'A5E.Inspiration', type: 'boolean' },
  primaryResource: { path: 'resources.primary.value', label: 'A5E.ResourcesPrimary', type: 'value' },
  secondaryResource: { path: 'resources.secondary.value', label: 'A5E.ResourcesSecondary', type: 'value' },
  tertiaryResource: { path: 'resources.tertiary.value', label: 'A5E.ResourcesTertiary', type: 'value' },
  quaternaryResource: { path: 'resources.quaternary.value', label: 'A5E.ResourcesQuaternary', type: 'value' }

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

A5E.spellConsumerModes = {
  variable: 'A5E.ConsumerSpellModeVariable',
  pointsOnly: 'A5E.ConsumerSpellModePointsOnly',
  slotsOnly: 'A5E.ConsumerSpellModeSlotsOnly'
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
  acr: 'A5E.SkillAcr',
  ani: 'A5E.SkillAni',
  arc: 'A5E.SkillArc',
  ath: 'A5E.SkillAth',
  cul: 'A5E.SkillCul',
  dec: 'A5E.SkillDec',
  eng: 'A5E.SkillEng',
  his: 'A5E.SkillHis',
  ins: 'A5E.SkillIns',
  itm: 'A5E.SkillItm',
  inv: 'A5E.SkillInv',
  med: 'A5E.SkillMed',
  nat: 'A5E.SkillNat',
  prc: 'A5E.SkillPrc',
  prf: 'A5E.SkillPrf',
  per: 'A5E.SkillPer',
  rel: 'A5E.SkillRel',
  slt: 'A5E.SkillSlt',
  ste: 'A5E.SkillSte',
  sur: 'A5E.SkillSur'
};

/**
 * The set of core skill specialties used in the system.
 */
A5E.skillSpecialties = {
  acr: {
    balancing: 'A5E.SkillSpecialtyBalancing',
    escapeArtistry: 'A5E.SkillSpecialtyEscapeArtistry',
    swinging: 'A5E.SkillSpecialtySwinging',
    tumbling: 'A5E.SkillSpecialtyTumbling'
  },
  ani: {
    calming: 'A5E.SkillSpecialtyCalming',
    driving: 'A5E.SkillSpecialtyDriving',
    farming: 'A5E.SkillSpecialtyFarming',
    riding: 'A5E.SkillSpecialtyRiding',
    training: 'A5E.SkillSpecialtyTraining'
  },
  arc: {
    aberrations: 'A5E.SkillSpecialtyAberrations',
    constructs: 'A5E.SkillSpecialtyConstructs',
    detection: 'A5E.SkillSpecialtyDetection',
    dragons: 'A5E.SkillSpecialtyDragons',
    elementals: 'A5E.SkillSpecialtyElementals',
    fey: 'A5E.SkillSpecialtyFey',
    forbiddenKnowledge: 'A5E.SkillSpecialtyForbiddenKnowledge',
    monstrosities: 'A5E.SkillSpecialtyMonstrosities',
    oozes: 'A5E.SkillSpecialtyOozes',
    thePlanes: 'A5E.SkillSpecialtyThePlanes'
  },
  ath: {
    climbing: 'A5E.SkillSpecialtyClimbing',
    jumping: 'A5E.SkillSpecialtyJumping',
    lifting: 'A5E.SkillSpecialtyLifting',
    running: 'A5E.SkillSpecialtyRunning',
    swimming: 'A5E.SkillSpecialtySwimming',
    throwing: 'A5E.SkillSpecialtyThrowing'
  },
  cul: {
    courtlyManners: 'A5E.SkillSpecialtyCourtlyManners',
    etiquette: 'A5E.SkillSpecialtyEtiquette',
    laws: 'A5E.SkillSpecialtyLaws',
    linguistics: 'A5E.SkillSpecialtyLinguistics',
    regionalGoods: 'A5E.SkillSpecialtyRegionalGoods',
    streetwise: 'A5E.SkillSpecialtyStreetwise',
    trade: 'A5E.SkillSpecialtyTrade'
  },
  dec: {
    boasting: 'A5E.SkillSpecialtyBoasting',
    ciphers: 'A5E.SkillSpecialtyCiphers',
    concealingEmotions: 'A5E.SkillSpecialtyConcealingEmotions',
    mimicry: 'A5E.SkillSpecialtyMimicry'
  },
  eng: {
    architecture: 'A5E.SkillSpecialtyArchitecture',
    chemistry: 'A5E.SkillSpecialtyChemistry',
    explosives: 'A5E.SkillSpecialtyExplosives',
    gadgetry: 'A5E.SkillSpecialtyGadgetry',
    mathematics: 'A5E.SkillSpecialtyMathematics',
    mechanicalTraps: 'A5E.SkillSpecialtyMechanicalTraps',
    siegecraft: 'A5E.SkillSpecialtySiegecraft'
  },
  his: {
    arts: 'A5E.SkillSpecialtyArts',
    empires: 'A5E.SkillSpecialtyEmpires',
    genealogy: 'A5E.SkillSpecialtyGenealogy',
    legends: 'A5E.SkillSpecialtyLegends',
    wars: 'A5E.SkillSpecialtyWars'
  },
  ins: {
    detectingLies: 'A5E.SkillSpecialtyDetectingLies',
    readingEmotions: 'A5E.SkillSpecialtyReadingEmotions',
    sensingMotives: 'A5E.SkillSpecialtySensingMotives'
  },
  itm: {
    authority: 'A5E.SkillSpecialtyAuthority',
    ferocity: 'A5E.SkillSpecialtyFerocity',
    interrogation: 'A5E.SkillSpecialtyInterrogation',
    subtleThreats: 'A5E.SkillSpecialtySubtleThreats',
    weaponDisplays: 'A5E.SkillSpecialtyWeaponDisplays'
  },
  inv: {
    appraisal: 'A5E.SkillSpecialtyAppraisal',
    deciphering: 'A5E.SkillSpecialtyDeciphering',
    forensics: 'A5E.SkillSpecialtyForensics',
    gatheringRumors: 'A5E.SkillSpecialtyGatheringRumors',
    research: 'A5E.SkillSpecialtyResearch',
    trapfinding: 'A5E.SkillSpecialtyTrapfinding'
  },
  med: {
    animals: 'A5E.SkillSpecialtyAnimals',
    autopsy: 'A5E.SkillSpecialtyAutopsy',
    diseases: 'A5E.SkillSpecialtyDiseases',
    herbalism: 'A5E.SkillSpecialtyHerbalism',
    poisons: 'A5E.SkillSpecialtyPoisons'
  },
  nat: {
    astronomy: 'A5E.SkillSpecialtyAstronomy',
    beastLore: 'A5E.SkillSpecialtyBeastLore',
    farming: 'A5E.SkillSpecialtyFarming',
    fey: 'A5E.SkillSpecialtyFey',
    plantLore: 'A5E.SkillSpecialtyPlantLore',
    weather: 'A5E.SkillSpecialtyWeather'
  },
  prc: {
    farsight: 'A5E.SkillSpecialtyFarsight',
    invisibleObjects: 'A5E.SkillSpecialtyInvisibleObjects',
    listening: 'A5E.SkillSpecialtyListening',
    scent: 'A5E.SkillSpecialtyScent'
  },
  prf: {
    acting: 'A5E.SkillSpecialtyActing',
    composing: 'A5E.SkillSpecialtyComposing',
    dancing: 'A5E.SkillSpecialtyDancing',
    fineArt: 'A5E.SkillSpecialtyFineArt',
    singing: 'A5E.SkillSpecialtySinging',
    speaking: 'A5E.SkillSpecialtySpeaking',
    writing: 'A5E.SkillSpecialtyWriting'
  },
  per: {
    bribery: 'A5E.SkillSpecialtyBribery',
    flattery: 'A5E.SkillSpecialtyFlattery',
    leadership: 'A5E.SkillSpecialtyLeadership',
    negotiation: 'A5E.SkillSpecialtyNegotiation',
    peacemaking: 'A5E.SkillSpecialtyPeacemaking'
  },
  rel: {
    alignment: 'A5E.SkillSpecialtyAlignment',
    celestials: 'A5E.SkillSpecialtyCelestials',
    cults: 'A5E.SkillSpecialtyCults',
    fiends: 'A5E.SkillSpecialtyFiends',
    gods: 'A5E.SkillSpecialtyGods',
    holySymbols: 'A5E.SkillSpecialtyHolySymbols',
    morality: 'A5E.SkillSpecialtyMorality',
    prophecy: 'A5E.SkillSpecialtyProphecy',
    undead: 'A5E.SkillSpecialtyUndead'
  },
  slt: {
    distraction: 'A5E.SkillSpecialtyDistraction',
    legerdemain: 'A5E.SkillSpecialtyLegerdemain',
    pickpocketing: 'A5E.SkillSpecialtyPickpocketing'
  },
  ste: {
    anonymity: 'A5E.SkillSpecialtyAnonymity',
    camouflage: 'A5E.SkillSpecialtyCamouflage',
    casing: 'A5E.SkillSpecialtyCasing'
  },
  sur: {
    dungeoneering: 'A5E.SkillSpecialtyDungeoneering',
    foraging: 'A5E.SkillSpecialtyForaging',
    hunting: 'A5E.SkillSpecialtyHunting',
    tracking: 'A5E.SkillSpecialtyTracking',
    wayfinding: 'A5E.SkillSpecialtyWayfinding'
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
  sm: 0.5,
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

A5E.tools = {
  artisansTools: {
    alchemistsSupplies: 'A5E.ToolAlchemistsSupplies',
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
  burn: 'A5E.WeaponPropertyBurn',
  breaker: 'A5E.WeaponPropertyBreaker',
  compounding: 'A5E.WeaponPropertyCompounding',
  defensive: 'A5E.WeaponPropertyDefensive',
  dualWielding: 'A5E.WeaponPropertyDualWielding',
  finesse: 'A5E.WeaponPropertyFinesse',
  flamboyant: 'A5E.WeaponPropertyFlamboyant',
  handMounted: 'A5E.WeaponPropertyHandMounted',
  heavy: 'A5E.WeaponPropertyHeavy',
  inaccurate: 'A5E.WeaponPropertyInaccurate',
  loading: 'A5E.WeaponPropertyLoading',
  mounted: 'A5E.WeaponPropertyMounted',
  muzzleLoading: 'A5E.WeaponPropertyMuzzleLoading',
  parrying: 'A5E.WeaponPropertyParrying',
  parryingImmunity: 'A5E.WeaponPropertyParryingImmunity',
  quickdraw: 'A5E.WeaponPropertyQuickdraw',
  range: 'A5E.WeaponPropertyRange',
  rebounding: 'A5E.ObjectPropertyRebounding',
  reach: 'A5E.WeaponPropertyReach',
  rifled: 'A5E.WeaponPropertyRifled',
  scatter: 'A5E.WeaponPropertyScatter',
  shock: 'A5E.WeaponPropertyShock',
  simple: 'A5E.WeaponPropertySimple',
  stealthy: 'A5E.ObjectPropertyStealthy',
  storage: 'A5E.ObjectPropertyStorage',
  thrown: 'A5E.WeaponPropertyThrown',
  triggerCharge: 'A5E.WeaponPropertyTriggerCharge',
  trip: 'A5E.WeaponPropertyTrip',
  twoHanded: 'A5E.WeaponPropertyTwoHanded',
  versatile: 'A5E.WeaponPropertyVersatile',
  vicious: 'A5E.WeaponPropertyVicious'
};

// ---------------------------------------------------
// Filter Data
/**
 * Data for filters on the spells page. Schools of magic are added in on the page.
 */
const abilityActionFilters = {};
Object.entries(A5E.abilityActivationTypes).forEach(([value, label]) => {
  abilityActionFilters[value] = { label, key: 'system.activation.type', type: 'action' };
});

A5E.filters = {
  features: {
    activationCost: {
      label: 'A5E.FilterLabelActivationCost',
      filters: { ...abilityActionFilters }
    }
  },
  maneuvers: {
    activationCost: {
      label: 'A5E.FilterLabelActivationCost',
      filters: { ...abilityActionFilters }
    },
    traditions: {
      label: 'A5E.FilterLabelManueverTraditions',
      filters: {}
    }
  },
  objects: {
    activationCost: {
      label: 'A5E.FilterLabelActivationCost',
      filters: { ...abilityActionFilters }
    },
    rarity: {
      label: 'A5E.FilterLabelRarity',
      filters: {}
    },
    miscellaneous: {
      label: 'A5E.FilterLabelMiscellaneous',
      filters: {
        attuned: { label: 'A5E.Attuned', key: 'system.attuned', type: 'boolean' },
        bulky: { label: 'A5E.ItemBulky', key: 'system.bulky', type: 'boolean' },
        equipped: { label: 'A5E.ItemEquipped', key: 'system.equipped', type: 'boolean' },
        plotItem: { label: 'A5E.PlotItem', key: 'system.plotItem', type: 'boolean' },
        requiresAttunement: { label: 'A5E.AttunementRequired', key: 'system.requiredAttunement', type: 'boolean' }
      }
    }
  },
  spells: {
    activationCost: {
      label: 'A5E.FilterLabelActivationCost',
      filters: { ...abilityActionFilters }
    },
    components: {
      label: 'A5E.FilterLabelSpellComponents',
      filters: {
        material: {
          label: 'A5E.SpellComponentMaterial',
          key: 'system.components.material',
          type: 'boolean'
        },
        seen: {
          label: 'A5E.SpellComponentSeen',
          key: 'system.components.seen',
          type: 'boolean'
        },
        vocalized: {
          label: 'A5E.SpellComponentVocalized',
          key: 'system.components.vocalized',
          type: 'boolean'
        }
      }
    },
    miscellaneous: {
      label: 'A5E.FilterLabelMiscellaneous',
      filters: {
        concentration: { label: 'A5E.ConditionConcentration', key: 'system.concentration', type: 'boolean' },
        ritual: { label: 'A5E.SpellRitual', key: 'system.ritual', type: 'boolean' },
        prepared: { label: 'A5E.SpellPrepared', key: 'system.prepared', type: 'boolean' }
      }
    },
    primarySpellSchools: {
      label: 'A5E.FilterLabelPrimarySpellSchools',
      filters: {}
    }
  }
};

Object.entries(A5E.maneuverTraditions).forEach(([value, label]) => {
  A5E.filters.maneuvers.traditions.filters[value] = {
    label, key: 'system.tradition', type: 'value'
  };
});

Object.entries(A5E.itemRarity).forEach(([value, label]) => {
  A5E.filters.objects.rarity.filters[value] = {
    label, key: 'system.rarity', type: 'value'
  };
});

Object.entries(A5E.spellSchools.primary).forEach(([value, label]) => {
  A5E.filters.spells.primarySpellSchools.filters[value] = {
    label, key: 'system.schools.primary', type: 'value'
  };
});

// ---------------------------------------------------
// Reducer Data
A5E.reducerSortMap = {
  features: {
    legendaryAction: 0,
    naturalWeapon: 1,
    class: 2,
    knack: 3,
    feat: 4,
    heritage: 5,
    culture: 6,
    background: 7,
    destiny: 8,
    boon: 9,
    other: 10
  },
  objects: {
    weapon: 0,
    armor: 1,
    shield: 2,
    ammunition: 3,
    container: 4,
    consumable: 5,
    tool: 6,
    jewelry: 7,
    clothing: 8,
    miscellaneous: 9
  }
};

/**
 * A set of human-interpretable names that we should display for each active effect key.
 * @enum {String}
 */
A5E.effectsKeyLocalizations = {
  'flags.a5e.effects.conditionImmunities.all': 'A5E.effects.keys.flags.conditionImmunities.all',
  'flags.a5e.effects.damageImmunities.all': 'A5E.effects.keys.flags.damageImmunities.all',
  'flags.a5e.effects.damageResistances.all': 'A5E.effects.keys.flags.damageResistances.all',
  'flags.a5e.effects.damageVulnerabilities.all': 'A5E.effects.keys.flags.damageVulnerabilities.all',
  'flags.a5e.effects.expertiseDie': 'A5E.effects.keys.flags.expertiseDie',
  'flags.a5e.effects.grants.rollMode.attack.all': 'A5E.effects.keys.flags.grantsRollMode.all',
  'flags.a5e.effects.grants.rollMode.attack.meleeSpellAttack': 'A5E.effects.keys.flags.grantsRollMode.meleeSpellAttack',
  'flags.a5e.effects.grants.rollMode.attack.meleeWeaponAttack': 'A5E.effects.keys.flags.grantsRollMode.meleeWeaponAttack',
  'flags.a5e.effects.grants.rollMode.attack.rangedSpellAttack': 'A5E.effects.keys.flags.grantsRollMode.rangedSpellAttack',
  'flags.a5e.effects.grants.rollMode.attack.rangedWeaponAttack': 'A5E.effects.keys.flags.grantsRollMode.rangedWeaponAttack',
  'flags.a5e.effects.rollMode.abilityCheck.all': 'A5E.effects.keys.flags.rollMode.abilityChecks.all',
  'flags.a5e.effects.rollMode.abilityCheck.cha': 'A5E.effects.keys.flags.rollMode.abilityChecks.cha',
  'flags.a5e.effects.rollMode.abilityCheck.con': 'A5E.effects.keys.flags.rollMode.abilityChecks.con',
  'flags.a5e.effects.rollMode.abilityCheck.dex': 'A5E.effects.keys.flags.rollMode.abilityChecks.dex',
  'flags.a5e.effects.rollMode.abilityCheck.int': 'A5E.effects.keys.flags.rollMode.abilityChecks.int',
  'flags.a5e.effects.rollMode.abilityCheck.str': 'A5E.effects.keys.flags.rollMode.abilityChecks.str',
  'flags.a5e.effects.rollMode.abilityCheck.wis': 'A5E.effects.keys.flags.rollMode.abilityChecks.wis',
  'flags.a5e.effects.rollMode.abilitySave.all': 'A5E.effects.keys.flags.rollMode.savingThrows.all',
  'flags.a5e.effects.rollMode.abilitySave.cha': 'A5E.effects.keys.flags.rollMode.savingThrows.cha',
  'flags.a5e.effects.rollMode.abilitySave.con': 'A5E.effects.keys.flags.rollMode.savingThrows.con',
  'flags.a5e.effects.rollMode.abilitySave.dex': 'A5E.effects.keys.flags.rollMode.savingThrows.dex',
  'flags.a5e.effects.rollMode.abilitySave.int': 'A5E.effects.keys.flags.rollMode.savingThrows.int',
  'flags.a5e.effects.rollMode.abilitySave.str': 'A5E.effects.keys.flags.rollMode.savingThrows.str',
  'flags.a5e.effects.rollMode.abilitySave.wis': 'A5E.effects.keys.flags.rollMode.savingThrows.wis',
  'flags.a5e.effects.rollMode.attack.all': 'A5E.effects.keys.flags.rollMode.attack.all',
  'flags.a5e.effects.rollMode.attack.meleeSpellAttack': 'A5E.effects.keys.flags.rollMode.attack.meleeSpellAttack',
  'flags.a5e.effects.rollMode.attack.meleeWeaponAttack': 'A5E.effects.keys.flags.rollMode.attack.meleeWeaponAttack',
  'flags.a5e.effects.rollMode.attack.rangedSpellAttack': 'A5E.effects.keys.flags.rollMode.attack.rangedSpellAttack',
  'flags.a5e.effects.rollMode.attack.rangedWeaponAttack': 'A5E.effects.keys.flags.rollMode.attack.rangedWeaponAttack',
  'flags.a5e.effects.rollMode.concentration': 'A5E.effects.keys.flags.rollMode.concentration',
  'flags.a5e.effects.rollMode.deathSave': 'A5E.effects.keys.flags.rollMode.deathSave',
  'flags.a5e.effects.rollMode.skillCheck.all': 'A5E.effects.keys.flags.rollMode.skillChecks.all',
  'flags.a5e.effects.rollMode.skillCheck.acr': 'A5E.effects.keys.flags.rollMode.skillChecks.acr',
  'flags.a5e.effects.rollMode.skillCheck.ani': 'A5E.effects.keys.flags.rollMode.skillChecks.ani',
  'flags.a5e.effects.rollMode.skillCheck.arc': 'A5E.effects.keys.flags.rollMode.skillChecks.arc',
  'flags.a5e.effects.rollMode.skillCheck.ath': 'A5E.effects.keys.flags.rollMode.skillChecks.ath',
  'flags.a5e.effects.rollMode.skillCheck.cul': 'A5E.effects.keys.flags.rollMode.skillChecks.cul',
  'flags.a5e.effects.rollMode.skillCheck.dec': 'A5E.effects.keys.flags.rollMode.skillChecks.dec',
  'flags.a5e.effects.rollMode.skillCheck.eng': 'A5E.effects.keys.flags.rollMode.skillChecks.eng',
  'flags.a5e.effects.rollMode.skillCheck.his': 'A5E.effects.keys.flags.rollMode.skillChecks.his',
  'flags.a5e.effects.rollMode.skillCheck.ins': 'A5E.effects.keys.flags.rollMode.skillChecks.ins',
  'flags.a5e.effects.rollMode.skillCheck.inv': 'A5E.effects.keys.flags.rollMode.skillChecks.inv',
  'flags.a5e.effects.rollMode.skillCheck.itm': 'A5E.effects.keys.flags.rollMode.skillChecks.itm',
  'flags.a5e.effects.rollMode.skillCheck.med': 'A5E.effects.keys.flags.rollMode.skillChecks.med',
  'flags.a5e.effects.rollMode.skillCheck.nat': 'A5E.effects.keys.flags.rollMode.skillChecks.nat',
  'flags.a5e.effects.rollMode.skillCheck.per': 'A5E.effects.keys.flags.rollMode.skillChecks.per',
  'flags.a5e.effects.rollMode.skillCheck.prc': 'A5E.effects.keys.flags.rollMode.skillChecks.prc',
  'flags.a5e.effects.rollMode.skillCheck.prf': 'A5E.effects.keys.flags.rollMode.skillChecks.prf',
  'flags.a5e.effects.rollMode.skillCheck.rel': 'A5E.effects.keys.flags.rollMode.skillChecks.rel',
  'flags.a5e.effects.rollMode.skillCheck.slt': 'A5E.effects.keys.flags.rollMode.skillChecks.slt',
  'flags.a5e.effects.rollMode.skillCheck.ste': 'A5E.effects.keys.flags.rollMode.skillChecks.ste',
  'flags.a5e.effects.rollMode.skillCheck.sur': 'A5E.effects.keys.flags.rollMode.skillChecks.sur',
  'system.abilities.cha.check.bonus': 'A5E.effects.keys.abilities.charismaCheckBonus',
  'system.abilities.cha.check.expertiseDice': 'A5E.effects.keys.abilities.charismaCheckExpertiseDice',
  'system.abilities.cha.save.bonus': 'A5E.effects.keys.abilities.charismaSaveBonus',
  'system.abilities.cha.save.expertiseDice': 'A5E.effects.keys.abilities.charismaSaveExpertiseDice',
  'system.abilities.cha.save.proficient': 'A5E.effects.keys.abilities.charismaSaveProficiency',
  'system.abilities.cha.value': 'A5E.effects.keys.abilities.charismaValue',
  'system.abilities.con.check.bonus': 'A5E.effects.keys.abilities.constitutionCheckBonus',
  'system.abilities.con.check.expertiseDice': 'A5E.effects.keys.abilities.constitutionCheckExpertiseDice',
  'system.abilities.con.save.bonus': 'A5E.effects.keys.abilities.constitutionSaveBonus',
  'system.abilities.con.save.concentrationBonus': 'A5E.effects.keys.abilities.constitutionSaveConcentrationBonus',
  'system.abilities.con.save.expertiseDice': 'A5E.effects.keys.abilities.constitutionSaveExpertiseDice',
  'system.abilities.con.save.proficient': 'A5E.effects.keys.abilities.constitutionSaveProficiency',
  'system.abilities.con.value': 'A5E.effects.keys.abilities.constitutionValue',
  'system.abilities.dex.check.bonus': 'A5E.effects.keys.abilities.dexterityCheckBonus',
  'system.abilities.dex.check.expertiseDice': 'A5E.effects.keys.abilities.dexterityCheckExpertiseDice',
  'system.abilities.dex.save.bonus': 'A5E.effects.keys.abilities.dexteritySaveBonus',
  'system.abilities.dex.save.expertiseDice': 'A5E.effects.keys.abilities.dexteritySaveExpertiseDice',
  'system.abilities.dex.save.proficient': 'A5E.effects.keys.abilities.dexteritySaveProficiency',
  'system.abilities.dex.value': 'A5E.effects.keys.abilities.dexterityValue',
  'system.abilities.int.check.bonus': 'A5E.effects.keys.abilities.intelligenceCheckBonus',
  'system.abilities.int.check.expertiseDice': 'A5E.effects.keys.abilities.intelligenceCheckExpertiseDice',
  'system.abilities.int.save.bonus': 'A5E.effects.keys.abilities.intelligenceSaveBonus',
  'system.abilities.int.save.expertiseDice': 'A5E.effects.keys.abilities.intelligenceSaveExpertiseDice',
  'system.abilities.int.save.proficient': 'A5E.effects.keys.abilities.intelligenceSaveProficiency',
  'system.abilities.int.value': 'A5E.effects.keys.abilities.intelligenceValue',
  'system.abilities.str.check.bonus': 'A5E.effects.keys.abilities.strengthCheckBonus',
  'system.abilities.str.check.expertiseDice': 'A5E.effects.keys.abilities.strengthCheckExpertiseDice',
  'system.abilities.str.save.bonus': 'A5E.effects.keys.abilities.strengthSaveBonus',
  'system.abilities.str.save.expertiseDice': 'A5E.effects.keys.abilities.strengthSaveExpertiseDice',
  'system.abilities.str.save.proficient': 'A5E.effects.keys.abilities.strengthSaveProficiency',
  'system.abilities.str.value': 'A5E.effects.keys.abilities.strengthValue',
  'system.abilities.wis.check.bonus': 'A5E.effects.keys.abilities.wisdomCheckBonus',
  'system.abilities.wis.check.expertiseDice': 'A5E.effects.keys.abilities.wisdomCheckExpertiseDice',
  'system.abilities.wis.save.bonus': 'A5E.effects.keys.abilities.wisdomSaveBonus',
  'system.abilities.wis.save.expertiseDice': 'A5E.effects.keys.abilities.wisdomSaveExpertiseDice',
  'system.abilities.wis.save.proficient': 'A5E.effects.keys.abilities.wisdomSaveProficiency',
  'system.abilities.wis.value': 'A5E.effects.keys.abilities.wisdomValue',
  'system.attributes.ac': 'A5E.effects.keys.armorClass',
  'system.attributes.attunement.current': 'A5E.effects.keys.attunementCurrent',
  'system.attributes.attunement.max': 'A5E.effects.keys.attunementMax',
  'system.attributes.casterLevel': 'A5E.effects.keys.casterLevel',
  'system.attributes.death.failure': 'A5E.effects.keys.deathSaveFailures',
  'system.attributes.death.success': 'A5E.effects.keys.deathSaveSuccesses',
  'system.attributes.exertion.current': 'A5E.effects.keys.exertionCurrent',
  'system.attributes.exertion.max': 'A5E.effects.keys.exertionMax',
  'system.attributes.exertion.recoverOnRest': 'A5E.effects.keys.recoverExertionOnShortRest',
  'system.attributes.fatigue': 'A5E.effects.keys.fatigue',
  'system.attributes.hitDice.d20.current': 'A5E.effects.keys.hitDice.d20Current',
  'system.attributes.hitDice.d20.total': 'A5E.effects.keys.hitDice.d20Max',
  'system.attributes.hitDice.d12.current': 'A5E.effects.keys.hitDice.d12Current',
  'system.attributes.hitDice.d12.total': 'A5E.effects.keys.hitDice.d12Max',
  'system.attributes.hitDice.d10.current': 'A5E.effects.keys.hitDice.d10Current',
  'system.attributes.hitDice.d10.total': 'A5E.effects.keys.hitDice.d10Max',
  'system.attributes.hitDice.d6.current': 'A5E.effects.keys.hitDice.d6Current',
  'system.attributes.hitDice.d6.total': 'A5E.effects.keys.hitDice.d6Max',
  'system.attributes.hitDice.d8.current': 'A5E.effects.keys.hitDice.d8Current',
  'system.attributes.hitDice.d8.total': 'A5E.effects.keys.hitDice.d8Max',
  'system.attributes.hitDice.d4.current': 'A5E.effects.keys.hitDice.d4Current',
  'system.attributes.hitDice.d4.total': 'A5E.effects.keys.hitDice.d4Max',
  'system.attributes.hp.baseMax': 'A5E.effects.keys.hitPoints.baseMax',
  'system.attributes.hp.bonus': 'A5E.effects.keys.hitPoints.bonus',
  'system.attributes.hp.value': 'A5E.effects.keys.hitPoints.current',
  'system.attributes.hp.max': 'A5E.effects.keys.hitPoints.max',
  'system.attributes.hp.temp': 'A5E.effects.keys.hitPoints.temp',
  'system.attributes.initiative.bonus': 'A5E.effects.keys.initiativeBonus',
  'system.attributes.initiative.expertiseDice': 'A5E.effects.keys.initiativeExpertiseDice',
  'system.attributes.inspiration': 'A5E.effects.keys.inspiration',
  'system.attributes.movement.burrow.distance': 'A5E.effects.keys.movement.burrowDistance',
  'system.attributes.movement.burrow.unit': 'A5E.effects.keys.movement.burrowUnit',
  'system.attributes.movement.climb.distance': 'A5E.effects.keys.movement.climbDistance',
  'system.attributes.movement.climb.unit': 'A5E.effects.keys.movement.climbUnit',
  'system.attributes.movement.fly.distance': 'A5E.effects.keys.movement.flyDistance',
  'system.attributes.movement.fly.unit': 'A5E.effects.keys.movement.flyUnit',
  'system.attributes.movement.swim.distance': 'A5E.effects.keys.movement.swimDistance',
  'system.attributes.movement.swim.unit': 'A5E.effects.keys.movement.swimUnit',
  'system.attributes.movement.traits.hover': 'A5E.effects.keys.movement.hover',
  'system.attributes.movement.walk.distance': 'A5E.effects.keys.movement.walkDistance',
  'system.attributes.movement.walk.unit': 'A5E.effects.keys.movement.walkUnit',
  'system.attributes.prof': 'A5E.effects.keys.proficiencyBonus',
  'system.attributes.senses.blindsight.distance': 'A5E.effects.keys.vision.blindsightDistance',
  'system.attributes.senses.blindsight.unit': 'A5E.effects.keys.vision.blindsightUnit',
  'system.attributes.senses.blindsight.otherwiseBlind': 'A5E.effects.keys.vision.blindsightOtherwiseBlind',
  'system.attributes.senses.darkvision.distance': 'A5E.effects.keys.vision.darkvisionDistance',
  'system.attributes.senses.darkvision.unit': 'A5E.effects.keys.vision.darkvisionUnit',
  'system.attributes.senses.tremorsense.distance': 'A5E.effects.keys.vision.tremorsenseDistance',
  'system.attributes.senses.tremorsense.unit': 'A5E.effects.keys.vision.tremorsenseUnit',
  'system.attributes.senses.truesight.distance': 'A5E.effects.keys.vision.truesightDistance',
  'system.attributes.senses.truesight.unit': 'A5E.effects.keys.vision.truesightUnit',
  'system.attributes.spellcasting': 'A5E.effects.keys.spellcastingAbility',
  'system.attributes.strife': 'A5E.effects.keys.strife',
  'system.bonuses.abilities.check': 'A5E.effects.keys.bonuses.check',
  'system.bonuses.abilities.save': 'A5E.effects.keys.bonuses.save',
  'system.bonuses.abilities.skill': 'A5E.effects.keys.bonuses.skill',
  'system.bonuses.maneuverDC': 'A5E.effects.keys.bonuses.maneuverDC',
  'system.bonuses.meleeSpellAttack': 'A5E.effects.keys.bonuses.meleeSpellAttack',
  'system.bonuses.meleeWeaponAttack': 'A5E.effects.keys.bonuses.meleeWeaponAttack',
  'system.bonuses.rangedSpellAttack': 'A5E.effects.keys.bonuses.rangedSpellAttack',
  'system.bonuses.rangedWeaponAttack': 'A5E.effects.keys.bonuses.rangedWeaponAttack',
  'system.bonuses.spellDC': 'A5E.effects.keys.bonuses.spellDC',
  'system.currency.cp': 'A5E.effects.keys.currency.cp',
  'system.currency.ep': 'A5E.effects.keys.currency.ep',
  'system.currency.gp': 'A5E.effects.keys.currency.gp',
  'system.currency.pp': 'A5E.effects.keys.currency.pp',
  'system.currency.sp': 'A5E.effects.keys.currency.sp',
  'system.details.creatureTypes': 'A5E.effects.keys.details.creatureTypes',
  'system.details.cr': 'A5E.effects.keys.details.cr',
  'system.details.elite': 'A5E.effects.keys.details.elite',
  'system.details.isSwarm': 'A5E.effects.keys.details.isSwarm',
  'system.proficiencies.armor': 'A5E.effects.keys.proficiencies.armor',
  'system.proficiencies.languages': 'A5E.effects.keys.proficiencies.languages',
  'system.proficiencies.tools': 'A5E.effects.keys.proficiencies.tools',
  'system.proficiencies.weapons': 'A5E.effects.keys.proficiencies.weapons',
  'system.resources.primary.hideMax': 'A5E.effects.keys.resources.primary.hideMax',
  'system.resources.primary.label': 'A5E.effects.keys.resources.primary.label',
  'system.resources.primary.max': 'A5E.effects.keys.resources.primary.max',
  'system.resources.primary.per': 'A5E.effects.keys.resources.primary.per',
  'system.resources.primary.recharge.formula': 'A5E.effects.keys.resources.primary.rechargeFormula',
  'system.resources.primary.recharge.threshold': 'A5E.effects.keys.resources.primary.rechargeThreshold',
  'system.resources.primary.value': 'A5E.effects.keys.resources.primary.value',
  'system.resources.quaternary.hideMax': 'A5E.effects.keys.resources.quaternary.hideMax',
  'system.resources.quaternary.label': 'A5E.effects.keys.resources.quaternary.label',
  'system.resources.quaternary.max': 'A5E.effects.keys.resources.quaternary.max',
  'system.resources.quaternary.per': 'A5E.effects.keys.resources.quaternary.per',
  'system.resources.quaternary.recharge.formula': 'A5E.effects.keys.resources.quaternary.rechargeFormula',
  'system.resources.quaternary.recharge.threshold': 'A5E.effects.keys.resources.quaternary.rechargeThreshold',
  'system.resources.quaternary.value': 'A5E.effects.keys.resources.quaternary.value',
  'system.resources.secondary.hideMax': 'A5E.effects.keys.resources.secondary.hideMax',
  'system.resources.secondary.label': 'A5E.effects.keys.resources.secondary.label',
  'system.resources.secondary.max': 'A5E.effects.keys.resources.secondary.max',
  'system.resources.secondary.per': 'A5E.effects.keys.resources.secondary.per',
  'system.resources.secondary.recharge.formula': 'A5E.effects.keys.resources.secondary.rechargeFormula',
  'system.resources.secondary.recharge.threshold': 'A5E.effects.keys.resources.secondary.rechargeThreshold',
  'system.resources.secondary.value': 'A5E.effects.keys.resources.secondary.value',
  'system.resources.tertiary.hideMax': 'A5E.effects.keys.resources.tertiary.hideMax',
  'system.resources.tertiary.label': 'A5E.effects.keys.resources.tertiary.label',
  'system.resources.tertiary.max': 'A5E.effects.keys.resources.tertiary.max',
  'system.resources.tertiary.per': 'A5E.effects.keys.resources.tertiary.per',
  'system.resources.tertiary.recharge.formula': 'A5E.effects.keys.resources.tertiary.rechargeFormula',
  'system.resources.tertiary.recharge.threshold': 'A5E.effects.keys.resources.tertiary.rechargeThreshold',
  'system.resources.tertiary.value': 'A5E.effects.keys.resources.tertiary.value',
  'system.skills.acr.ability': 'A5E.effects.keys.skills.acr.defaultAbility',
  'system.skills.acr.bonuses.check': 'A5E.effects.keys.skills.acr.checkBonus',
  'system.skills.acr.bonuses.passive': 'A5E.effects.keys.skills.acr.passiveBonus',
  'system.skills.acr.expertiseDice': 'A5E.effects.keys.skills.acr.expertiseDice',
  'system.skills.acr.minRoll': 'A5E.effects.keys.skills.acr.minRoll',
  'system.skills.acr.proficient': 'A5E.effects.keys.skills.acr.proficient',
  'system.skills.acr.specialties': 'A5E.effects.keys.skills.acr.specialties',
  'system.skills.acr.value': 'A5E.effects.keys.skills.acr.value',
  'system.skills.ani.ability': 'A5E.effects.keys.skills.ani.defaultAbility',
  'system.skills.ani.bonuses.check': 'A5E.effects.keys.skills.ani.checkBonus',
  'system.skills.ani.bonuses.passive': 'A5E.effects.keys.skills.ani.passiveBonus',
  'system.skills.ani.expertiseDice': 'A5E.effects.keys.skills.ani.expertiseDice',
  'system.skills.ani.minRoll': 'A5E.effects.keys.skills.ani.minRoll',
  'system.skills.ani.proficient': 'A5E.effects.keys.skills.ani.proficient',
  'system.skills.ani.specialties': 'A5E.effects.keys.skills.ani.specialties',
  'system.skills.ani.value': 'A5E.effects.keys.skills.ani.value',
  'system.skills.arc.ability': 'A5E.effects.keys.skills.arc.defaultAbility',
  'system.skills.arc.bonuses.check': 'A5E.effects.keys.skills.arc.checkBonus',
  'system.skills.arc.bonuses.passive': 'A5E.effects.keys.skills.arc.passiveBonus',
  'system.skills.arc.expertiseDice': 'A5E.effects.keys.skills.arc.expertiseDice',
  'system.skills.arc.minRoll': 'A5E.effects.keys.skills.arc.minRoll',
  'system.skills.arc.proficient': 'A5E.effects.keys.skills.arc.proficient',
  'system.skills.arc.specialties': 'A5E.effects.keys.skills.arc.specialties',
  'system.skills.arc.value': 'A5E.effects.keys.skills.arc.value',
  'system.skills.ath.ability': 'A5E.effects.keys.skills.ath.defaultAbility',
  'system.skills.ath.bonuses.check': 'A5E.effects.keys.skills.ath.checkBonus',
  'system.skills.ath.bonuses.passive': 'A5E.effects.keys.skills.ath.passiveBonus',
  'system.skills.ath.expertiseDice': 'A5E.effects.keys.skills.ath.expertiseDice',
  'system.skills.ath.minRoll': 'A5E.effects.keys.skills.ath.minRoll',
  'system.skills.ath.proficient': 'A5E.effects.keys.skills.ath.proficient',
  'system.skills.ath.specialties': 'A5E.effects.keys.skills.ath.specialties',
  'system.skills.ath.value': 'A5E.effects.keys.skills.ath.value',
  'system.skills.cul.ability': 'A5E.effects.keys.skills.cul.defaultAbility',
  'system.skills.cul.bonuses.check': 'A5E.effects.keys.skills.cul.checkBonus',
  'system.skills.cul.bonuses.passive': 'A5E.effects.keys.skills.cul.passiveBonus',
  'system.skills.cul.expertiseDice': 'A5E.effects.keys.skills.cul.expertiseDice',
  'system.skills.cul.minRoll': 'A5E.effects.keys.skills.cul.minRoll',
  'system.skills.cul.proficient': 'A5E.effects.keys.skills.cul.proficient',
  'system.skills.cul.specialties': 'A5E.effects.keys.skills.cul.specialties',
  'system.skills.cul.value': 'A5E.effects.keys.skills.cul.value',
  'system.skills.dec.ability': 'A5E.effects.keys.skills.dec.defaultAbility',
  'system.skills.dec.bonuses.check': 'A5E.effects.keys.skills.dec.checkBonus',
  'system.skills.dec.bonuses.passive': 'A5E.effects.keys.skills.dec.passiveBonus',
  'system.skills.dec.expertiseDice': 'A5E.effects.keys.skills.dec.expertiseDice',
  'system.skills.dec.minRoll': 'A5E.effects.keys.skills.dec.minRoll',
  'system.skills.dec.proficient': 'A5E.effects.keys.skills.dec.proficient',
  'system.skills.dec.specialties': 'A5E.effects.keys.skills.dec.specialties',
  'system.skills.dec.value': 'A5E.effects.keys.skills.dec.value',
  'system.skills.eng.ability': 'A5E.effects.keys.skills.eng.defaultAbility',
  'system.skills.eng.bonuses.check': 'A5E.effects.keys.skills.eng.checkBonus',
  'system.skills.eng.bonuses.passive': 'A5E.effects.keys.skills.eng.passiveBonus',
  'system.skills.eng.expertiseDice': 'A5E.effects.keys.skills.eng.expertiseDice',
  'system.skills.eng.minRoll': 'A5E.effects.keys.skills.eng.minRoll',
  'system.skills.eng.proficient': 'A5E.effects.keys.skills.eng.proficient',
  'system.skills.eng.specialties': 'A5E.effects.keys.skills.eng.specialties',
  'system.skills.eng.value': 'A5E.effects.keys.skills.eng.value',
  'system.skills.his.ability': 'A5E.effects.keys.skills.his.defaultAbility',
  'system.skills.his.bonuses.check': 'A5E.effects.keys.skills.his.checkBonus',
  'system.skills.his.bonuses.passive': 'A5E.effects.keys.skills.his.passiveBonus',
  'system.skills.his.expertiseDice': 'A5E.effects.keys.skills.his.expertiseDice',
  'system.skills.his.minRoll': 'A5E.effects.keys.skills.his.minRoll',
  'system.skills.his.proficient': 'A5E.effects.keys.skills.his.proficient',
  'system.skills.his.specialties': 'A5E.effects.keys.skills.his.specialties',
  'system.skills.his.value': 'A5E.effects.keys.skills.his.value',
  'system.skills.ins.ability': 'A5E.effects.keys.skills.ins.defaultAbility',
  'system.skills.ins.bonuses.check': 'A5E.effects.keys.skills.ins.checkBonus',
  'system.skills.ins.bonuses.passive': 'A5E.effects.keys.skills.ins.passiveBonus',
  'system.skills.ins.expertiseDice': 'A5E.effects.keys.skills.ins.expertiseDice',
  'system.skills.ins.minRoll': 'A5E.effects.keys.skills.ins.minRoll',
  'system.skills.ins.proficient': 'A5E.effects.keys.skills.ins.proficient',
  'system.skills.ins.specialties': 'A5E.effects.keys.skills.ins.specialties',
  'system.skills.ins.value': 'A5E.effects.keys.skills.ins.value',
  'system.skills.itm.ability': 'A5E.effects.keys.skills.itm.defaultAbility',
  'system.skills.itm.bonuses.check': 'A5E.effects.keys.skills.itm.checkBonus',
  'system.skills.itm.bonuses.passive': 'A5E.effects.keys.skills.itm.passiveBonus',
  'system.skills.itm.expertiseDice': 'A5E.effects.keys.skills.itm.expertiseDice',
  'system.skills.itm.minRoll': 'A5E.effects.keys.skills.itm.minRoll',
  'system.skills.itm.proficient': 'A5E.effects.keys.skills.itm.proficient',
  'system.skills.itm.specialties': 'A5E.effects.keys.skills.itm.specialties',
  'system.skills.itm.value': 'A5E.effects.keys.skills.itm.value',
  'system.skills.inv.ability': 'A5E.effects.keys.skills.inv.defaultAbility',
  'system.skills.inv.bonuses.check': 'A5E.effects.keys.skills.inv.checkBonus',
  'system.skills.inv.bonuses.passive': 'A5E.effects.keys.skills.inv.passiveBonus',
  'system.skills.inv.expertiseDice': 'A5E.effects.keys.skills.inv.expertiseDice',
  'system.skills.inv.minRoll': 'A5E.effects.keys.skills.inv.minRoll',
  'system.skills.inv.proficient': 'A5E.effects.keys.skills.inv.proficient',
  'system.skills.inv.specialties': 'A5E.effects.keys.skills.inv.specialties',
  'system.skills.inv.value': 'A5E.effects.keys.skills.inv.value',
  'system.skills.med.ability': 'A5E.effects.keys.skills.med.defaultAbility',
  'system.skills.med.bonuses.check': 'A5E.effects.keys.skills.med.checkBonus',
  'system.skills.med.bonuses.passive': 'A5E.effects.keys.skills.med.passiveBonus',
  'system.skills.med.expertiseDice': 'A5E.effects.keys.skills.med.expertiseDice',
  'system.skills.med.minRoll': 'A5E.effects.keys.skills.med.minRoll',
  'system.skills.med.proficient': 'A5E.effects.keys.skills.med.proficient',
  'system.skills.med.specialties': 'A5E.effects.keys.skills.med.specialties',
  'system.skills.med.value': 'A5E.effects.keys.skills.med.value',
  'system.skills.nat.ability': 'A5E.effects.keys.skills.nat.defaultAbility',
  'system.skills.nat.bonuses.check': 'A5E.effects.keys.skills.nat.checkBonus',
  'system.skills.nat.bonuses.passive': 'A5E.effects.keys.skills.nat.passiveBonus',
  'system.skills.nat.expertiseDice': 'A5E.effects.keys.skills.nat.expertiseDice',
  'system.skills.nat.minRoll': 'A5E.effects.keys.skills.nat.minRoll',
  'system.skills.nat.proficient': 'A5E.effects.keys.skills.nat.proficient',
  'system.skills.nat.specialties': 'A5E.effects.keys.skills.nat.specialties',
  'system.skills.nat.value': 'A5E.effects.keys.skills.nat.value',
  'system.skills.prc.ability': 'A5E.effects.keys.skills.prc.defaultAbility',
  'system.skills.prc.bonuses.check': 'A5E.effects.keys.skills.prc.checkBonus',
  'system.skills.prc.bonuses.passive': 'A5E.effects.keys.skills.prc.passiveBonus',
  'system.skills.prc.expertiseDice': 'A5E.effects.keys.skills.prc.expertiseDice',
  'system.skills.prc.minRoll': 'A5E.effects.keys.skills.prc.minRoll',
  'system.skills.prc.proficient': 'A5E.effects.keys.skills.prc.proficient',
  'system.skills.prc.specialties': 'A5E.effects.keys.skills.prc.specialties',
  'system.skills.prc.value': 'A5E.effects.keys.skills.prc.value',
  'system.skills.prf.ability': 'A5E.effects.keys.skills.prf.defaultAbility',
  'system.skills.prf.bonuses.check': 'A5E.effects.keys.skills.prf.checkBonus',
  'system.skills.prf.bonuses.passive': 'A5E.effects.keys.skills.prf.passiveBonus',
  'system.skills.prf.expertiseDice': 'A5E.effects.keys.skills.prf.expertiseDice',
  'system.skills.prf.minRoll': 'A5E.effects.keys.skills.prf.minRoll',
  'system.skills.prf.proficient': 'A5E.effects.keys.skills.prf.proficient',
  'system.skills.prf.specialties': 'A5E.effects.keys.skills.prf.specialties',
  'system.skills.prf.value': 'A5E.effects.keys.skills.prf.value',
  'system.skills.per.ability': 'A5E.effects.keys.skills.per.defaultAbility',
  'system.skills.per.bonuses.check': 'A5E.effects.keys.skills.per.checkBonus',
  'system.skills.per.bonuses.passive': 'A5E.effects.keys.skills.per.passiveBonus',
  'system.skills.per.expertiseDice': 'A5E.effects.keys.skills.per.expertiseDice',
  'system.skills.per.minRoll': 'A5E.effects.keys.skills.per.minRoll',
  'system.skills.per.proficient': 'A5E.effects.keys.skills.per.proficient',
  'system.skills.per.specialties': 'A5E.effects.keys.skills.per.specialties',
  'system.skills.per.value': 'A5E.effects.keys.skills.per.value',
  'system.skills.rel.ability': 'A5E.effects.keys.skills.rel.defaultAbility',
  'system.skills.rel.bonuses.check': 'A5E.effects.keys.skills.rel.checkBonus',
  'system.skills.rel.bonuses.passive': 'A5E.effects.keys.skills.rel.passiveBonus',
  'system.skills.rel.expertiseDice': 'A5E.effects.keys.skills.rel.expertiseDice',
  'system.skills.rel.minRoll': 'A5E.effects.keys.skills.rel.minRoll',
  'system.skills.rel.proficient': 'A5E.effects.keys.skills.rel.proficient',
  'system.skills.rel.specialties': 'A5E.effects.keys.skills.rel.specialties',
  'system.skills.rel.value': 'A5E.effects.keys.skills.rel.value',
  'system.skills.slt.ability': 'A5E.effects.keys.skills.slt.defaultAbility',
  'system.skills.slt.bonuses.check': 'A5E.effects.keys.skills.slt.checkBonus',
  'system.skills.slt.bonuses.passive': 'A5E.effects.keys.skills.slt.passiveBonus',
  'system.skills.slt.expertiseDice': 'A5E.effects.keys.skills.slt.expertiseDice',
  'system.skills.slt.minRoll': 'A5E.effects.keys.skills.slt.minRoll',
  'system.skills.slt.proficient': 'A5E.effects.keys.skills.slt.proficient',
  'system.skills.slt.specialties': 'A5E.effects.keys.skills.slt.specialties',
  'system.skills.slt.value': 'A5E.effects.keys.skills.slt.value',
  'system.skills.ste.ability': 'A5E.effects.keys.skills.ste.defaultAbility',
  'system.skills.ste.bonuses.check': 'A5E.effects.keys.skills.ste.checkBonus',
  'system.skills.ste.bonuses.passive': 'A5E.effects.keys.skills.ste.passiveBonus',
  'system.skills.ste.expertiseDice': 'A5E.effects.keys.skills.ste.expertiseDice',
  'system.skills.ste.minRoll': 'A5E.effects.keys.skills.ste.minRoll',
  'system.skills.ste.proficient': 'A5E.effects.keys.skills.ste.proficient',
  'system.skills.ste.specialties': 'A5E.effects.keys.skills.ste.specialties',
  'system.skills.ste.value': 'A5E.effects.keys.skills.ste.value',
  'system.skills.sur.ability': 'A5E.effects.keys.skills.sur.defaultAbility',
  'system.skills.sur.bonuses.check': 'A5E.effects.keys.skills.sur.checkBonus',
  'system.skills.sur.bonuses.passive': 'A5E.effects.keys.skills.sur.passiveBonus',
  'system.skills.sur.expertiseDice': 'A5E.effects.keys.skills.sur.expertiseDice',
  'system.skills.sur.minRoll': 'A5E.effects.keys.skills.sur.minRoll',
  'system.skills.sur.proficient': 'A5E.effects.keys.skills.sur.proficient',
  'system.skills.sur.specialties': 'A5E.effects.keys.skills.sur.specialties',
  'system.skills.sur.value': 'A5E.effects.keys.skills.sur.value',
  'system.spellResources.points.current': 'A5E.effects.keys.spellResources.currentSpellPoints',
  'system.spellResources.points.max': 'A5E.effects.keys.spellResources.maxSpellPoints',
  'system.spellResources.slots.1.current': 'A5E.effects.keys.spellResources.currentLevel1Slots',
  'system.spellResources.slots.1.max': 'A5E.effects.keys.spellResources.maxLevel1Slots',
  'system.spellResources.slots.2.current': 'A5E.effects.keys.spellResources.currentLevel2Slots',
  'system.spellResources.slots.2.max': 'A5E.effects.keys.spellResources.maxLevel2Slots',
  'system.spellResources.slots.3.current': 'A5E.effects.keys.spellResources.currentLevel3Slots',
  'system.spellResources.slots.3.max': 'A5E.effects.keys.spellResources.maxLevel3Slots',
  'system.spellResources.slots.4.current': 'A5E.effects.keys.spellResources.currentLevel4Slots',
  'system.spellResources.slots.4.max': 'A5E.effects.keys.spellResources.maxLevel4Slots',
  'system.spellResources.slots.5.current': 'A5E.effects.keys.spellResources.currentLevel5Slots',
  'system.spellResources.slots.5.max': 'A5E.effects.keys.spellResources.maxLevel5Slots',
  'system.spellResources.slots.6.current': 'A5E.effects.keys.spellResources.currentLevel6Slots',
  'system.spellResources.slots.6.max': 'A5E.effects.keys.spellResources.maxLevel6Slots',
  'system.spellResources.slots.7.current': 'A5E.effects.keys.spellResources.currentLevel7Slots',
  'system.spellResources.slots.7.max': 'A5E.effects.keys.spellResources.maxLevel7Slots',
  'system.spellResources.slots.8.current': 'A5E.effects.keys.spellResources.currentLevel8Slots',
  'system.spellResources.slots.8.max': 'A5E.effects.keys.spellResources.maxLevel8Slots',
  'system.spellResources.slots.9.current': 'A5E.effects.keys.spellResources.currentLevel9Slots',
  'system.spellResources.slots.9.max': 'A5E.effects.keys.spellResources.maxLevel9Slots',
  'system.supply': 'A5E.effects.keys.supply',
  'system.traits.conditionImmunities': 'A5E.effects.keys.traits.conditionImmunities',
  'system.traits.damageImmunities': 'A5E.effects.keys.traits.damageImmunities',
  'system.traits.damageResistances': 'A5E.effects.keys.traits.damageResistances',
  'system.traits.damageVulnerabilities': 'A5E.effects.keys.traits.damageVulnerabilities',
  'system.traits.size': 'A5E.effects.keys.traits.size'
};

A5E.effectKeyGroups = {
  abilityChecks: {
    label: 'A5E.effects.groups.abilityChecks',
    items: [
      'flags.a5e.effects.rollMode.abilityCheck.all',
      'flags.a5e.effects.rollMode.abilityCheck.cha',
      'flags.a5e.effects.rollMode.abilityCheck.con',
      'flags.a5e.effects.rollMode.abilityCheck.dex',
      'flags.a5e.effects.rollMode.abilityCheck.int',
      'flags.a5e.effects.rollMode.abilityCheck.str',
      'flags.a5e.effects.rollMode.abilityCheck.wis',
      'system.abilities.cha.check.bonus',
      'system.abilities.cha.check.expertiseDice',
      'system.abilities.cha.value',
      'system.abilities.con.check.bonus',
      'system.abilities.con.check.expertiseDice',
      'system.abilities.con.value',
      'system.abilities.dex.check.bonus',
      'system.abilities.dex.check.expertiseDice',
      'system.abilities.dex.value',
      'system.abilities.int.check.bonus',
      'system.abilities.int.check.expertiseDice',
      'system.abilities.int.value',
      'system.abilities.str.check.bonus',
      'system.abilities.str.check.expertiseDice',
      'system.abilities.str.value',
      'system.abilities.wis.check.bonus',
      'system.abilities.wis.check.expertiseDice',
      'system.abilities.wis.value'
    ]
  },
  attackRollModes: {
    label: 'A5E.effects.groups.attackRollModes',
    items: [
      'flags.a5e.effects.rollMode.attack.all',
      'flags.a5e.effects.rollMode.attack.meleeSpellAttack',
      'flags.a5e.effects.rollMode.attack.meleeWeaponAttack',
      'flags.a5e.effects.rollMode.attack.rangedSpellAttack',
      'flags.a5e.effects.rollMode.attack.rangedWeaponAttack'
    ]
  },
  attunement: {
    label: 'A5E.effects.groups.attunement',
    items: [
      'system.attributes.attunement.current',
      'system.attributes.attunement.max'
    ]
  },
  bonuses: {
    label: 'A5E.effects.groups.bonuses',
    items: [
      'system.bonuses.abilities.check',
      'system.bonuses.abilities.save',
      'system.bonuses.abilities.skill',
      'system.bonuses.maneuverDC',
      'system.bonuses.meleeSpellAttack',
      'system.bonuses.meleeWeaponAttack',
      'system.bonuses.rangedSpellAttack',
      'system.bonuses.rangedWeaponAttack',
      'system.bonuses.spellDC'
    ]
  },
  conditions: {
    label: 'A5E.effects.groups.conditions',
    items: [
      'system.attributes.fatigue',
      'system.attributes.strife'
    ]
  },
  currency: {
    label: 'A5E.effects.groups.currency',
    items: [
      'system.currency.cp',
      'system.currency.ep',
      'system.currency.gp',
      'system.currency.pp',
      'system.currency.sp'
    ]
  },
  creatureTraits: {
    label: 'A5E.effects.groups.creatureTraits',
    items: [
      'system.traits.size',
      'system.details.creatureTypes',
      'system.details.isSwarm'
    ]
  },
  deathSaves: {
    label: 'A5E.effects.groups.deathSaves',
    items: [
      'flags.a5e.effects.rollMode.deathSave',
      'system.attributes.death.failure',
      'system.attributes.death.success'
    ]
  },
  exertion: {
    label: 'A5E.effects.groups.exertion',
    items: [
      'system.attributes.exertion.current',
      'system.attributes.exertion.max',
      'system.attributes.exertion.recoverOnRest'
    ]
  },
  hitDice: {
    label: 'A5E.effects.groups.hitDice',
    items: [
      'system.attributes.hitDice.d20.current',
      'system.attributes.hitDice.d20.total',
      'system.attributes.hitDice.d12.current',
      'system.attributes.hitDice.d12.total',
      'system.attributes.hitDice.d10.current',
      'system.attributes.hitDice.d10.total',
      'system.attributes.hitDice.d6.current',
      'system.attributes.hitDice.d6.total',
      'system.attributes.hitDice.d8.current',
      'system.attributes.hitDice.d8.total',
      'system.attributes.hitDice.d4.current',
      'system.attributes.hitDice.d4.total'
    ]
  },
  hitPoints: {
    label: 'A5E.effects.groups.hitPoints',
    items: [
      'system.attributes.hp.baseMax',
      'system.attributes.hp.bonus',
      'system.attributes.hp.value',
      'system.attributes.hp.max',
      'system.attributes.hp.temp'
    ]
  },
  initiative: {
    label: 'A5E.effects.groups.initiative',
    items: [
      'system.attributes.initiative.bonus',
      'system.attributes.initiative.expertiseDice'
    ]
  },
  movement: {
    label: 'A5E.effects.groups.movement',
    items: [
      'system.attributes.movement.burrow.distance',
      'system.attributes.movement.burrow.unit',
      'system.attributes.movement.climb.distance',
      'system.attributes.movement.climb.unit',
      'system.attributes.movement.fly.distance',
      'system.attributes.movement.fly.unit',
      'system.attributes.movement.swim.distance',
      'system.attributes.movement.swim.unit',
      'system.attributes.movement.traits.hover',
      'system.attributes.movement.walk.distance',
      'system.attributes.movement.walk.unit'
    ]
  },
  proficiencies: {
    label: 'A5E.effects.groups.proficiencies',
    items: [
      'system.proficiencies.armor',
      'system.proficiencies.languages',
      'system.proficiencies.tools',
      'system.proficiencies.weapons'
    ]
  },
  resistancesVulnerabilitiesImmunities: {
    label: 'A5E.effects.groups.resistancesVulnerabilitiesImmunities',
    items: [
      'flags.a5e.effects.conditionImmunities.all',
      'flags.a5e.effects.damageImmunities.all',
      'flags.a5e.effects.damageResistances.all',
      'flags.a5e.effects.damageVulnerabilities.all',
      'system.traits.conditionImmunities',
      'system.traits.damageImmunities',
      'system.traits.damageResistances',
      'system.traits.damageVulnerabilities'
    ]
  },
  resources: {
    label: 'A5E.effects.groups.resources',
    items: [
      'system.resources.primary.hideMax',
      'system.resources.primary.label',
      'system.resources.primary.max',
      'system.resources.primary.per',
      'system.resources.primary.recharge.formula',
      'system.resources.primary.recharge.threshold',
      'system.resources.primary.value',
      'system.resources.quaternary.hideMax',
      'system.resources.quaternary.label',
      'system.resources.quaternary.max',
      'system.resources.quaternary.per',
      'system.resources.quaternary.recharge.formula',
      'system.resources.quaternary.recharge.threshold',
      'system.resources.quaternary.value',
      'system.resources.secondary.hideMax',
      'system.resources.secondary.label',
      'system.resources.secondary.max',
      'system.resources.secondary.per',
      'system.resources.secondary.recharge.formula',
      'system.resources.secondary.recharge.threshold',
      'system.resources.secondary.value',
      'system.resources.tertiary.hideMax',
      'system.resources.tertiary.label',
      'system.resources.tertiary.max',
      'system.resources.tertiary.per',
      'system.resources.tertiary.recharge.formula',
      'system.resources.tertiary.recharge.threshold',
      'system.resources.tertiary.value'
    ]
  },
  savingThrows: {
    label: 'A5E.effects.groups.savingThrows',
    items: [
      'flags.a5e.effects.rollMode.abilitySave.all',
      'flags.a5e.effects.rollMode.abilitySave.cha',
      'flags.a5e.effects.rollMode.abilitySave.con',
      'flags.a5e.effects.rollMode.abilitySave.dex',
      'flags.a5e.effects.rollMode.abilitySave.int',
      'flags.a5e.effects.rollMode.abilitySave.str',
      'flags.a5e.effects.rollMode.abilitySave.wis',
      'flags.a5e.effects.rollMode.concentration',
      'system.abilities.cha.save.bonus',
      'system.abilities.cha.save.expertiseDice',
      'system.abilities.cha.save.proficient',
      'system.abilities.con.save.bonus',
      'system.abilities.con.save.concentrationBonus',
      'system.abilities.con.save.expertiseDice',
      'system.abilities.con.save.proficient',
      'system.abilities.dex.save.bonus',
      'system.abilities.dex.save.expertiseDice',
      'system.abilities.dex.save.proficient',
      'system.abilities.int.save.bonus',
      'system.abilities.int.save.expertiseDice',
      'system.abilities.int.save.proficient',
      'system.abilities.str.save.bonus',
      'system.abilities.str.save.expertiseDice',
      'system.abilities.str.save.proficient',
      'system.abilities.wis.save.bonus',
      'system.abilities.wis.save.expertiseDice',
      'system.abilities.wis.save.proficient'
    ]
  },
  senses: {
    label: 'A5E.effects.groups.senses',
    items: [
      'system.attributes.senses.blindsight.distance',
      'system.attributes.senses.blindsight.unit',
      'system.attributes.senses.blindsight.otherwiseBlind',
      'system.attributes.senses.darkvision.distance',
      'system.attributes.senses.darkvision.unit',
      'system.attributes.senses.tremorsense.distance',
      'system.attributes.senses.tremorsense.unit',
      'system.attributes.senses.truesight.distance',
      'system.attributes.senses.truesight.unit'
    ]
  },
  skills: {
    label: 'A5E.effects.groups.skills',
    items: [
      'flags.a5e.effects.rollMode.skillCheck.all',
      'flags.a5e.effects.rollMode.skillCheck.acr',
      'flags.a5e.effects.rollMode.skillCheck.ani',
      'flags.a5e.effects.rollMode.skillCheck.arc',
      'flags.a5e.effects.rollMode.skillCheck.ath',
      'flags.a5e.effects.rollMode.skillCheck.cul',
      'flags.a5e.effects.rollMode.skillCheck.dec',
      'flags.a5e.effects.rollMode.skillCheck.eng',
      'flags.a5e.effects.rollMode.skillCheck.his',
      'flags.a5e.effects.rollMode.skillCheck.ins',
      'flags.a5e.effects.rollMode.skillCheck.inv',
      'flags.a5e.effects.rollMode.skillCheck.itm',
      'flags.a5e.effects.rollMode.skillCheck.med',
      'flags.a5e.effects.rollMode.skillCheck.nat',
      'flags.a5e.effects.rollMode.skillCheck.per',
      'flags.a5e.effects.rollMode.skillCheck.prc',
      'flags.a5e.effects.rollMode.skillCheck.prf',
      'flags.a5e.effects.rollMode.skillCheck.rel',
      'flags.a5e.effects.rollMode.skillCheck.slt',
      'flags.a5e.effects.rollMode.skillCheck.ste',
      'flags.a5e.effects.rollMode.skillCheck.sur',
      'system.skills.acr.ability',
      'system.skills.acr.bonuses.check',
      'system.skills.acr.bonuses.passive',
      'system.skills.acr.expertiseDice',
      'system.skills.acr.minRoll',
      'system.skills.acr.proficient',
      'system.skills.acr.specialties',
      'system.skills.acr.value',
      'system.skills.ani.ability',
      'system.skills.ani.bonuses.check',
      'system.skills.ani.bonuses.passive',
      'system.skills.ani.expertiseDice',
      'system.skills.ani.minRoll',
      'system.skills.ani.proficient',
      'system.skills.ani.specialties',
      'system.skills.ani.value',
      'system.skills.arc.ability',
      'system.skills.arc.bonuses.check',
      'system.skills.arc.bonuses.passive',
      'system.skills.arc.expertiseDice',
      'system.skills.arc.minRoll',
      'system.skills.arc.proficient',
      'system.skills.arc.specialties',
      'system.skills.arc.value',
      'system.skills.ath.ability',
      'system.skills.ath.bonuses.check',
      'system.skills.ath.bonuses.passive',
      'system.skills.ath.expertiseDice',
      'system.skills.ath.minRoll',
      'system.skills.ath.proficient',
      'system.skills.ath.specialties',
      'system.skills.ath.value',
      'system.skills.cul.ability',
      'system.skills.cul.bonuses.check',
      'system.skills.cul.bonuses.passive',
      'system.skills.cul.expertiseDice',
      'system.skills.cul.minRoll',
      'system.skills.cul.proficient',
      'system.skills.cul.specialties',
      'system.skills.cul.value',
      'system.skills.dec.ability',
      'system.skills.dec.bonuses.check',
      'system.skills.dec.bonuses.passive',
      'system.skills.dec.expertiseDice',
      'system.skills.dec.minRoll',
      'system.skills.dec.proficient',
      'system.skills.dec.specialties',
      'system.skills.dec.value',
      'system.skills.eng.ability',
      'system.skills.eng.bonuses.check',
      'system.skills.eng.bonuses.passive',
      'system.skills.eng.expertiseDice',
      'system.skills.eng.minRoll',
      'system.skills.eng.proficient',
      'system.skills.eng.specialties',
      'system.skills.eng.value',
      'system.skills.his.ability',
      'system.skills.his.bonuses.check',
      'system.skills.his.bonuses.passive',
      'system.skills.his.expertiseDice',
      'system.skills.his.minRoll',
      'system.skills.his.proficient',
      'system.skills.his.specialties',
      'system.skills.his.value',
      'system.skills.ins.ability',
      'system.skills.ins.bonuses.check',
      'system.skills.ins.bonuses.passive',
      'system.skills.ins.expertiseDice',
      'system.skills.ins.minRoll',
      'system.skills.ins.proficient',
      'system.skills.ins.specialties',
      'system.skills.ins.value',
      'system.skills.itm.ability',
      'system.skills.itm.bonuses.check',
      'system.skills.itm.bonuses.passive',
      'system.skills.itm.expertiseDice',
      'system.skills.itm.minRoll',
      'system.skills.itm.proficient',
      'system.skills.itm.specialties',
      'system.skills.itm.value',
      'system.skills.inv.ability',
      'system.skills.inv.bonuses.check',
      'system.skills.inv.bonuses.passive',
      'system.skills.inv.expertiseDice',
      'system.skills.inv.minRoll',
      'system.skills.inv.proficient',
      'system.skills.inv.specialties',
      'system.skills.inv.value',
      'system.skills.med.ability',
      'system.skills.med.bonuses.check',
      'system.skills.med.bonuses.passive',
      'system.skills.med.expertiseDice',
      'system.skills.med.minRoll',
      'system.skills.med.proficient',
      'system.skills.med.specialties',
      'system.skills.med.value',
      'system.skills.nat.ability',
      'system.skills.nat.bonuses.check',
      'system.skills.nat.bonuses.passive',
      'system.skills.nat.expertiseDice',
      'system.skills.nat.minRoll',
      'system.skills.nat.proficient',
      'system.skills.nat.specialties',
      'system.skills.nat.value',
      'system.skills.prc.ability',
      'system.skills.prc.bonuses.check',
      'system.skills.prc.bonuses.passive',
      'system.skills.prc.expertiseDice',
      'system.skills.prc.minRoll',
      'system.skills.prc.proficient',
      'system.skills.prc.specialties',
      'system.skills.prc.value',
      'system.skills.prf.ability',
      'system.skills.prf.bonuses.check',
      'system.skills.prf.bonuses.passive',
      'system.skills.prf.expertiseDice',
      'system.skills.prf.minRoll',
      'system.skills.prf.proficient',
      'system.skills.prf.specialties',
      'system.skills.prf.value',
      'system.skills.per.ability',
      'system.skills.per.bonuses.check',
      'system.skills.per.bonuses.passive',
      'system.skills.per.expertiseDice',
      'system.skills.per.minRoll',
      'system.skills.per.proficient',
      'system.skills.per.specialties',
      'system.skills.per.value',
      'system.skills.rel.ability',
      'system.skills.rel.bonuses.check',
      'system.skills.rel.bonuses.passive',
      'system.skills.rel.expertiseDice',
      'system.skills.rel.minRoll',
      'system.skills.rel.proficient',
      'system.skills.rel.specialties',
      'system.skills.rel.value',
      'system.skills.slt.ability',
      'system.skills.slt.bonuses.check',
      'system.skills.slt.bonuses.passive',
      'system.skills.slt.expertiseDice',
      'system.skills.slt.minRoll',
      'system.skills.slt.proficient',
      'system.skills.slt.specialties',
      'system.skills.slt.value',
      'system.skills.ste.ability',
      'system.skills.ste.bonuses.check',
      'system.skills.ste.bonuses.passive',
      'system.skills.ste.expertiseDice',
      'system.skills.ste.minRoll',
      'system.skills.ste.proficient',
      'system.skills.ste.specialties',
      'system.skills.ste.value',
      'system.skills.sur.ability',
      'system.skills.sur.bonuses.check',
      'system.skills.sur.bonuses.passive',
      'system.skills.sur.expertiseDice',
      'system.skills.sur.minRoll',
      'system.skills.sur.proficient',
      'system.skills.sur.specialties',
      'system.skills.sur.value'
    ]
  },
  spellResources: {
    label: 'A5E.effects.groups.spellResources',
    items: [
      'system.spellResources.points.current',
      'system.spellResources.points.max',
      'system.spellResources.slots.1.current',
      'system.spellResources.slots.1.max',
      'system.spellResources.slots.2.current',
      'system.spellResources.slots.2.max',
      'system.spellResources.slots.3.current',
      'system.spellResources.slots.3.max',
      'system.spellResources.slots.4.current',
      'system.spellResources.slots.4.max',
      'system.spellResources.slots.5.current',
      'system.spellResources.slots.5.max',
      'system.spellResources.slots.6.current',
      'system.spellResources.slots.6.max',
      'system.spellResources.slots.7.current',
      'system.spellResources.slots.7.max',
      'system.spellResources.slots.8.current',
      'system.spellResources.slots.8.max',
      'system.spellResources.slots.9.current',
      'system.spellResources.slots.9.max'
    ]
  },
  other: {
    label: 'A5E.effects.groups.other',
    items: []
  }
};

/* A list of all of the keys that can be prelocalized. Any new objects with static content should
 * be added to this list.
 */
A5E.PRELOCALIZED_KEYS = [
  'DICE_ROLL_MODES',
  'abilities',
  'abilityAbbreviations',
  'abilityActivationTypes',
  'abilityActivationTypesPlural',
  'actionOptions',
  'actorSizes',
  'ammunitionProperties',
  'areaTypes',
  'armor',
  'armorProperties',
  'attackTypes',
  'conditions',
  'creatureTypes',
  'damageTypes',
  'distanceAbbreviations',
  'distanceUnits',
  'effectsKeyLocalizations',
  'featureTypes',
  'healingTypes',
  'itemRarity',
  'itemTypes',
  'languages',
  'maneuverDegrees',
  'maneuverTraditions',
  'materialProperties',
  'movement',
  'movementAbbreviations',
  'objectTypes',
  'objectTypesPlural',
  'rangeDescriptors',
  'resourceRecoveryOptions',
  'rollModes',
  'saveDCOptions',
  'senses',
  'shieldTypes',
  'skills',
  'skillSpecialties.acr',
  'skillSpecialties.ani',
  'skillSpecialties.arc',
  'skillSpecialties.ath',
  'skillSpecialties.cul',
  'skillSpecialties.dec',
  'skillSpecialties.eng',
  'skillSpecialties.his',
  'skillSpecialties.ins',
  'skillSpecialties.itm',
  'skillSpecialties.inv',
  'skillSpecialties.med',
  'skillSpecialties.nat',
  'skillSpecialties.prc',
  'skillSpecialties.prf',
  'skillSpecialties.per',
  'skillSpecialties.rel',
  'skillSpecialties.slt',
  'skillSpecialties.ste',
  'skillSpecialties.sur',
  'spellComponents',
  'spellComponentAbbreviations',
  'spellConsumerModes',
  'spellLevels',
  'spellSchools.primary',
  'spellSchools.secondary',
  'targetTypes',
  'targetTypesPlural',
  'timePeriods',
  'timePeriodsPlural',
  'visionUnits',
  'tools.artisansTools',
  'tools.gamingSets',
  'tools.musicalInstruments',
  'tools.miscellaneous',
  'tools.vehicles',
  'toolsPlural.artisansTools',
  'toolsPlural.gamingSets',
  'toolsPlural.musicalInstruments',
  'toolsPlural.miscellaneous',
  'toolsPlural.vehicles',
  'weapons.simple',
  'weapons.martial',
  'weapons.rare',
  'weaponsPlural.simple',
  'weaponsPlural.martial',
  'weaponsPlural.rare',
  'weaponProperties'
];

export default A5E;
