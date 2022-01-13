const A5E = {};

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
 * Localized abbreviations for ability scores.
 * @enum {string}
 */
A5E.abilityActivationTypes = {
  action: 'A5E.ActionActivationAction',
  bonusAction: 'A5E.ActionActivationBonusAction',
  lairAction: 'A5E.ActionActivationLairAction',
  legendaryAction: 'A5E.ActionActivationLegendaryAction',
  none: 'A5E.ActionActivationNone',
  reaction: 'A5E.ActionActivationReaction',
  special: 'A5E.ActionActivationSpecial'
};

A5E.actionOptions = {
  abilityCheck: 'A5E.ActionOptionAbilityCheck',
  attack: 'A5E.ActionOptionAttack',
  damage: 'A5E.ActionOptionDamage',
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
  grg: 'A5E.SizeGargantuan'
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
  rangedSpellAttack: 'A5E.AttackTypeRangedSpell',
  unarmed: 'A5E.AttackTypeUnarmed'
};

/**
 * The set of core conditions in the system.
 * @enum {string}
 */
A5E.conditions = {
  blinded: 'A5E.ConditionBlinded',
  Bloodied: 'A5E.ConditionBloodied',
  charmed: 'A5E.ConditionCharmed',
  confused: 'A5E.ConditionConfused',
  deafened: 'A5E.ConditionDeafened',
  doomed: 'A5E.ConditionDoomed',
  encumbered: 'A5E.ConditionEncumbered',
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
  bitingZephyr: 'A5E.ManeuverTraditionBitingZephyr',
  mirrorsGlint: 'A5E.ManeuverTraditionMirrorsGlint',
  mistAndShade: 'A5E.ManeuverTraditionMistAndShade',
  rapidCurrent: 'A5E.ManeuverTraditionRapidCurrent',
  razorsEdge: 'A5E.ManeuverTraditionRazorsEdge',
  sanguineKnot: 'A5E.ManeuverTraditionSanguineKnot',
  spiritedSteed: 'A5E.ManeuverTraditionSpiritedSteed',
  temperedIron: 'A5E.ManeuverTraditionTemperedIron',
  toothAndClaw: 'A5E.ManeuverTraditionToothAndClaw',
  unendingWheel: 'A5E.ManeuverTraditionUnendingWheel'
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
 * The set of core range types in the system.
 * @enum {string}
 */
A5E.rangeDescriptors = {
  self: 'A5E.RangeSelf',
  touch: 'A5E.RangeTouch',
  short: 'A5E.RangeShort',
  medium: 'A5E.RangeMedium',
  long: 'A5E.RangeLong',
  other: 'A5E.RangeOther'
};

A5E.rangeValues = {
  self: 'A5E.RangeSelf',
  touch: 'A5E.RangeTouch',
  short: 30,
  medium: 60,
  long: 120
};

A5E.rollModes = {
  normal: 'A5E.RollModeNormal',
  advantage: 'A5E.RollModeAdvantage',
  disadvantage: 'A5E.RollModeDisadvantage'
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

A5E.spellComponents = {
  vocalized: 'A5E.SpellComponentVocalized',
  seen: 'A5E.SpellComponentSeen',
  material: 'A5E.SpellComponentMaterial'
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
    nature: 'A5E.SpellSchoolNature',
    necrotic: 'A5E.SpellSchoolNecrotic',
    negation: 'A5E.SpellSchoolNegation',
    obscurement: 'A5E.SpellSchoolObscurement',
    planar: 'A5E.SpellSchoolPlanar',
    plants: 'A5E.SpellSchoolPlants',
    poison: 'A5E.SpellSchoolPoison',
    prismatic: 'A5E.SpellSchoolPrismatic',
    protection: 'A5E.SpellSchoolProtection',
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

A5E.targetTypes = {
  self: 'A5E.TargetSelf',
  area: 'A5E.TargetArea',
  creature: 'A5E.TargetCreature',
  object: 'A5E.TargetObject',
  creatureObject: 'A5E.TargetCreatureObject',
  none: 'A5E.TargetNone',
  other: 'A5E.TargetOther'
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

export default A5E;
