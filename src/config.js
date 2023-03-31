const A5E = {};

A5E.ROLL_MODE = {
  NORMAL: 0,
  ADVANTAGE: 1,
  DISADVANTAGE: -1
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
  str: 'A5E.AbilityStr',
  dex: 'A5E.AbilityDex',
  con: 'A5E.AbilityCon',
  int: 'A5E.AbilityInt',
  wis: 'A5E.AbilityWis',
  cha: 'A5E.AbilityCha'
};

/**
 * Localized abbreviations for ability scores.
 * @enum {string}
 */
A5E.abilityAbbreviations = {
  str: 'A5E.AbilityStrAbbr',
  dex: 'A5E.AbilityDexAbbr',
  con: 'A5E.AbilityConAbbr',
  int: 'A5E.AbilityIntAbbr',
  wis: 'A5E.AbilityWisAbbr',
  cha: 'A5E.AbilityChaAbbr'
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
  cone: '<i class="fas fa-wifi"></i>',
  cube: '<i class="fas fa-cube"></i>',
  cylinder: '<i class="fas fa-circle"></i>',
  line: '<i class="fas fa-grip-lines"></i>',
  sphere: '<i class="far fa-circle"></i>'
};

A5E.areaTypes = {
  cone: 'A5E.AreaCone',
  cube: 'A5E.AreaCube',
  cylinder: 'A5E.AreaCylinder',
  line: 'A5E.AreaLine',
  sphere: 'A5E.AreaSphere'
};

/**
 * Maps the area types to template shapes
 */
A5E.areaTemplates = {
  cone: 'cone',
  cube: 'rect',
  cylinder: 'circle',
  line: 'ray',
  sphere: 'circle'
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

/**
 * The set of core damage types in the system.
 * @enum {string}
 */
A5E.damageTypes = {
  acid: 'A5E.DamageAcid',
  bludgeoning: 'A5E.DamageBludgeoning',
  cold: 'A5E.DamageCold',
  fire: 'A5E.DamageFire',
  force: 'A5E.DamageForce',
  lightning: 'A5E.DamageLightning',
  necrotic: 'A5E.DamageNecrotic',
  piercing: 'A5E.DamagePiercing',
  poison: 'A5E.DamagePoison',
  psychic: 'A5E.DamagePsychic',
  radiant: 'A5E.DamageRadiant',
  slashing: 'A5E.DamageSlashing',
  thunder: 'A5E.DamageThunder'
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
  adamantMountain: 'A5E.ManeuverTraditionAdamantMountain',
  arcaneArtillery: 'A5E.ManeuverTraditionArcaneArtillery',
  arcaneKnight: 'A5E.ManeuverTraditionArcaneKnight',
  awakenedMind: 'A5E.ManeuverTraditionAwakenedMind',
  beastUnity: 'A5E.ManeuverTraditionBeastUnity',
  bitingZephyr: 'A5E.ManeuverTraditionBitingZephyr',
  cuttingOmen: 'A5E.ManeuverTraditionCuttingOmen',
  eldritchBlackguard: 'A5E.ManeuverTraditionEldritchBlackguard',
  mirrorsGlint: 'A5E.ManeuverTraditionMirrorsGlint',
  mistAndShade: 'A5E.ManeuverTraditionMistAndShade',
  rapidCurrent: 'A5E.ManeuverTraditionRapidCurrent',
  razorsEdge: 'A5E.ManeuverTraditionRazorsEdge',
  sanguineKnot: 'A5E.ManeuverTraditionSanguineKnot',
  spiritedSteed: 'A5E.ManeuverTraditionSpiritedSteed',
  temperedIron: 'A5E.ManeuverTraditionTemperedIron',
  toothAndClaw: 'A5E.ManeuverTraditionToothAndClaw',
  unendingWheel: 'A5E.ManeuverTraditionUnendingWheel',
  vipersFangs: 'A5E.ManeuverTraditionVipersFangs'
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
    attack: 'A5E.SpellSchoolAttack',
    beasts: 'A5E.SpellSchoolBeasts',
    chaos: 'A5E.SpellSchoolChaos',
    cold: 'A5E.SpellSchoolCold',
    communication: 'A5E.SpellSchoolCommunication',
    compulsion: 'A5E.SpellSchoolCompulsion',
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

/* A list of all of the keys that can be prelocalized. Any new objects with static content should
 * be added to this list.
 */
A5E.PRELOCALIZED_KEYS = [
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
