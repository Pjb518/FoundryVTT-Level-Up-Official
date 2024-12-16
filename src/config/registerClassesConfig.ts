export default function registerClassesConfig() {
  const classes = {
    adept: 'A5E.characterClasses.adept',
    artificer: 'A5E.characterClasses.artificer',
    artificerrevised: 'A5E.characterClasses.artificerrevised',
    bard: 'A5E.characterClasses.bard',
    berserker: 'A5E.characterClasses.berserker',
    bloodblade: 'A5E.characterClasses.bloodblade',
    cleric: 'A5E.characterClasses.cleric',
    dirgesinger: 'A5E.characterClasses.dirgesinger',
    druid: 'A5E.characterClasses.druid',
    elementalist: 'A5E.characterClasses.elementalist',
    fighter: 'A5E.characterClasses.fighter',
    gambler: 'A5E.characterClasses.gambler',
    herald: 'A5E.characterClasses.herald',
    marshal: 'A5E.characterClasses.marshal',
    ranger: 'A5E.characterClasses.ranger',
    rogue: 'A5E.characterClasses.rogue',
    savant: 'A5E.characterClasses.savant',
    scholar: 'A5E.characterClasses.scholar',
    sorcerer: 'A5E.characterClasses.sorcerer',
    warlock: 'A5E.characterClasses.warlock',
    wielder: 'A5E.characterClasses.wielder',
    witch: 'A5E.characterClasses.witch',
    wizard: 'A5E.characterClasses.wizard'
  };

  const classes5e = {
    dnd5eArtificer: 'A5E.characterClasses.artificer',
    dnd5eBarbarian: 'A5E.characterClasses.barbarian',
    dnd5eBard: 'A5E.characterClasses.bard',
    dnd5eCleric: 'A5E.characterClasses.cleric',
    dnd5eDruid: 'A5E.characterClasses.druid',
    dnd5eFighter: 'A5E.characterClasses.fighter',
    dnd5eMonk: 'A5E.characterClasses.monk',
    dnd5ePaladin: 'A5E.characterClasses.paladin',
    dnd5eRanger: 'A5E.characterClasses.ranger',
    dnd5eRogue: 'A5E.characterClasses.rogue',
    dnd5eSorcerer: 'A5E.characterClasses.sorcerer',
    dnd5eWarlock: 'A5E.characterClasses.warlock',
    dnd5eWizard: 'A5E.characterClasses.wizard'
  };

  const classLevelTypes = {
    character: 'A5E.classes.levelTypes.character',
    class: 'A5E.classes.levelTypes.class'
  };

  const classHPTypes = {
    average: 'A5E.classes.hpTypes.average',
    roll: 'A5E.classes.hpTypes.roll',
    custom: 'A5E.classes.hpTypes.custom'
  };

  const casterTypes = {
    none: 'A5E.None',
    fullCaster: 'A5E.classes.casterTypes.fullCaster',
    halfCaster: 'A5E.classes.casterTypes.halfCaster',
    halfCasterWithFirstLevel: 'A5E.classes.casterTypes.halfCasterWithFirstLevel',
    tertiaryCaster: 'A5E.classes.casterTypes.tertiaryCaster',
    quaternaryCaster: 'A5E.classes.casterTypes.quaternaryCaster',
    artificerA5e: 'A5E.classes.casterTypes.artificerA5e',
    elementalist: 'A5E.classes.casterTypes.elementalist',
    herald: 'A5E.classes.casterTypes.herald',
    warlockA5e: 'A5E.classes.casterTypes.warlockA5e',
    warlock5e: 'A5E.classes.casterTypes.warlock5e',
    wielder: 'A5E.classes.casterTypes.wielder'
  };

  const exertionPoolTypes = {
    none: 'A5E.classes.exertionPoolTypes.none',
    prof: 'A5E.classes.exertionPoolTypes.prof',
    doubleProf: 'A5E.classes.exertionPoolTypes.double'
  };

  // ------------------------------------------------------------
  // Spell Casting Progression
  // ------------------------------------------------------------
  const SPELL_SLOT_TABLE = {
    1: [2],
    2: [3],
    3: [4, 2],
    4: [4, 3],
    5: [4, 3, 2],
    6: [4, 3, 3],
    7: [4, 3, 3, 1],
    8: [4, 3, 3, 2],
    9: [4, 3, 3, 3, 1],
    10: [4, 3, 3, 3, 2],
    11: [4, 3, 3, 3, 2, 1],
    12: [4, 3, 3, 3, 2, 1],
    13: [4, 3, 3, 3, 2, 1, 1],
    14: [4, 3, 3, 3, 2, 1, 1],
    15: [4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
  };

  const SPELL_POINTS_TABLE_ELEMENTALIST = {
    1: { points: 2, level: 1 },
    2: { points: 4, level: 1 },
    3: { points: 5, level: 1 },
    4: { points: 6, level: 1 },
    5: { points: 7, level: 2 },
    6: { points: 8, level: 2 },
    7: { points: 9, level: 2 },
    8: { points: 10, level: 2 },
    9: { points: 11, level: 3 },
    10: { points: 12, level: 3 },
    11: { points: 13, level: 3 },
    12: { points: 14, level: 3 },
    13: { points: 15, level: 4 },
    14: { points: 16, level: 4 },
    15: { points: 17, level: 4 },
    16: { points: 18, level: 4 },
    17: { points: 19, level: 5 },
    18: { points: 20, level: 5 },
    19: { points: 21, level: 5 },
    20: { points: 22, level: 5 }
  };

  const SPELL_POINTS_TABLE_WARLOCK = {
    1: { points: 2, level: 1 },
    2: { points: 4, level: 1 },
    3: { points: 6, level: 2 },
    4: { points: 8, level: 2 },
    5: { points: 10, level: 3 },
    6: { points: 11, level: 3 },
    7: { points: 12, level: 4 },
    8: { points: 13, level: 4 },
    9: { points: 14, level: 5 },
    10: { points: 17, level: 5 },
    11: { points: 21, level: 5 },
    12: { points: 22, level: 5 },
    13: { points: 24, level: 5 },
    14: { points: 25, level: 5 },
    15: { points: 26, level: 5 },
    16: { points: 27, level: 5 },
    17: { points: 28, level: 5 },
    18: { points: 29, level: 5 },
    19: { points: 30, level: 5 },
    20: { points: 31, level: 5 }
  };

  const PACT_SLOT_TABLE = {
    1: { slots: 1, level: 1 },
    2: { slots: 2, level: 1 },
    3: { slots: 2, level: 2 },
    4: { slots: 2, level: 2 },
    5: { slots: 2, level: 3 },
    6: { slots: 2, level: 3 },
    7: { slots: 2, level: 4 },
    8: { slots: 2, level: 4 },
    9: { slots: 2, level: 5 },
    10: { slots: 2, level: 5 },
    11: { slots: 3, level: 5 },
    12: { slots: 3, level: 5 },
    13: { slots: 3, level: 5 },
    14: { slots: 3, level: 5 },
    15: { slots: 3, level: 5 },
    16: { slots: 3, level: 5 },
    17: { slots: 4, level: 5 },
    18: { slots: 4, level: 5 },
    19: { slots: 4, level: 5 },
    20: { slots: 4, level: 5 }
  };

  const ARTIFICER_SPELL_INVENTIONS = {
    1: { count: 2, level: 1 },
    2: { count: 2, level: 1 },
    3: { count: 2, level: 1 },
    4: { count: 2, level: 1 },
    5: { count: 2, level: 2 },
    6: { count: 3, level: 2 },
    7: { count: 3, level: 2 },
    8: { count: 3, level: 2 },
    9: { count: 3, level: 3 },
    10: { count: 4, level: 3 },
    11: { count: 4, level: 3 },
    12: { count: 4, level: 3 },
    13: { count: 4, level: 4 },
    14: { count: 5, level: 4 },
    15: { count: 5, level: 4 },
    16: { count: 5, level: 4 },
    17: { count: 5, level: 5 },
    18: { count: 6, level: 5 },
    19: { count: 6, level: 5 },
    20: { count: 6, level: 5 }
  };

  const WIELDER_ARTIFACT_CHARGES = {
    1: { charges: 2, level: 1 },
    2: { charges: 4, level: 1 },
    3: { charges: 5, level: 1 },
    4: { charges: 6, level: 1 },
    5: { charges: 7, level: 2 },
    6: { charges: 8, level: 2 },
    7: { charges: 9, level: 2 },
    8: { charges: 10, level: 2 },
    9: { charges: 11, level: 3 },
    10: { charges: 12, level: 3 },
    11: { charges: 13, level: 3 },
    12: { charges: 14, level: 3 },
    13: { charges: 15, level: 4 },
    14: { charges: 16, level: 4 },
    15: { charges: 17, level: 4 },
    16: { charges: 18, level: 4 },
    17: { charges: 19, level: 5 },
    18: { charges: 20, level: 5 },
    19: { charges: 21, level: 5 },
    20: { charges: 22, level: 5 }
  };

  const casterProgression = {
    none: { type: null, config: null, reference: null },
    fullCaster: {
      type: 'multiplier',
      config: SPELL_SLOT_TABLE,
      resource: 'slots',
      multiplier: 1
    },
    halfCaster: {
      type: 'multiplier',
      config: SPELL_SLOT_TABLE,
      resource: 'slots',
      multiplier: 0.5
    },
    tertiaryCaster: {
      type: 'multiplier',
      config: SPELL_SLOT_TABLE,
      resource: 'slots',
      multiplier: 0.33
    },
    quaternaryCaster: {
      type: 'multiplier',
      config: SPELL_SLOT_TABLE,
      resource: 'slots',
      multiplier: 0.25
    },
    halfCasterWithFirstLevel: {
      type: 'multiplier',
      config: SPELL_SLOT_TABLE,
      resource: 'slots',
      multiplier: 0.5,
      roundUp: true,
      roundUpMulti: true
    },
    artificerA5e: {
      type: 'reference',
      config: ARTIFICER_SPELL_INVENTIONS,
      resource: 'inventions'
    },
    elementalist: {
      type: 'reference',
      config: SPELL_POINTS_TABLE_ELEMENTALIST,
      resource: 'points',
      multiclassMode: 'ADD'
    },
    herald: {
      type: 'multiplier',
      config: SPELL_SLOT_TABLE,
      resource: 'slots',
      multiplier: 0.5,
      roundUp: true,
      roundUpMulti: false
    },
    warlockA5e: {
      type: 'reference',
      config: SPELL_POINTS_TABLE_WARLOCK,
      resource: 'points',
      multiclassMode: 'ADD'
    },
    warlock5e: {
      type: 'reference',
      config: PACT_SLOT_TABLE,
      resource: 'slots'
    },
    wielder: {
      type: 'reference',
      config: WIELDER_ARTIFACT_CHARGES,
      resource: 'artifactCharges'
    }
  };

  return {
    classes,
    classes5e,
    classLevelTypes,
    classHPTypes,
    casterTypes,
    exertionPoolTypes,
    SPELL_SLOT_TABLE,
    SPELL_POINTS_TABLE_ELEMENTALIST,
    SPELL_POINTS_TABLE_WARLOCK,
    PACT_SLOT_TABLE,
    ARTIFICER_SPELL_INVENTIONS,
    WIELDER_ARTIFACT_CHARGES,
    casterProgression
  };
}
