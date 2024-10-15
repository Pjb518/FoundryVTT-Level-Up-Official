function generateChanges(A5E) {
  const MODES = A5E.ACTIVE_EFFECT_MODES;

  return {
    blinded: [
      {
        key: 'flags.a5e.effects.rollMode.attack.all',
        value: -1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionBlinded'
      },
      {
        key: 'flags.a5e.effects.grants.rollMode.attack.all',
        value: 1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionBlinded'
      }
    ],

    bloodied: [],

    charmed: [],

    concentration: [],

    confused: [],

    corruption: [],

    dazzled: [],

    deafened: [],

    dead: [],

    doomed: [],

    encumbered: [
      ...Object.keys(A5E.movement).map((type) => (
        {
          key: `system.attributes.movement.${type}.distance`,
          value: '{"comparisonOperator":"==","comparisonValue":"0","positiveValue":"0","negativeValue":"5"}',
          mode: MODES.CONDITIONAL,
          priority: MODES.CONDITIONAL * 10,
          label: 'A5E.ConditionGrappled'
        }))
    ],

    enervated: [],

    fatigue: [],

    fixated: [],

    frightened: [],

    grappled: [
      ...Object.keys(A5E.movement).map((type) => (
        {
          key: `system.attributes.movement.${type}.distance`,
          value: '0',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'A5E.ConditionGrappled'
        }))
    ],

    hungover: [
      {
        key: 'system.abilities.con.save.bonus',
        value: '-2',
        mode: MODES.ADD,
        priority: MODES.ADD * 10,
        label: 'A5E.ConditionHungover'
      },
      {
        key: 'flags.a5e.effects.rollMode.skillCheck.prc',
        value: -1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionHungover'
      }
    ],

    incapacitated: [],

    inebriated: [],

    invisible: [
      {
        key: 'flags.a5e.effects.rollMode.attack.all',
        value: 1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionInvisible'
      },
      {
        key: 'flags.a5e.effects.grants.rollMode.attack.all',
        value: -1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionInvisible'
      }
    ],

    paralyzed: [
      {
        key: 'flags.a5e.effects.grants.rollMode.attack.all',
        value: -1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionParalyzed'
      }
    ],

    petrified: [
      ...Object.keys(A5E.damageTypes).map((damageType) => ({
        key: 'system.traits.damageResistances',
        value: damageType,
        mode: MODES.ADD,
        priority: MODES.ADD * 10,
        label: 'A5E.ConditionPetrified'
      }))
      // TODO: Possible immunity to poisoned?
    ],

    poisoned: [
      {
        key: 'flags.a5e.effects.rollMode.attack.all',
        value: -1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionPoisoned'
      },
      {
        key: 'flags.a5e.effects.rollMode.abilityCheck.all',
        value: -1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionPoisoned'
      }
    ],

    prone: [
      {
        key: 'flags.a5e.effects.rollMode.attack.meleeWeapon',
        value: -1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionProne'
      }
    ],

    rattled: [
      {
        key: 'flags.a5e.effects.expertiseDice',
        value: 0,
        mode: MODES.OVERRIDE,
        priority: 200,
        label: 'A5E.ConditionRattled'
      }
    ],

    restrained: [
      {
        key: 'flags.a5e.effects.grants.rollMode.attack.all',
        value: 1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionRestrained'
      },
      {
        key: 'flags.a5e.effects.rollMode.attack.all',
        value: -1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionRestrained'
      },
      {
        key: 'flags.a5e.effects.rollMode.abilitySave.dex',
        value: -1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionRestrained'
      },
      ...Object.keys(A5E.movement).map((type) => (
        {
          key: `system.attributes.movement.${type}.distance`,
          value: '0',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'A5E.ConditionGrappled'
        }))
    ],

    slowed: [
      {
        key: 'system.attributes.ac.changes.bonuses.value',
        value: '-2',
        mode: MODES.ADD,
        priority: MODES.ADD * 10,
        label: 'A5E.ConditionSlowed'
      },
      {
        key: 'system.abilities.dex.save.bonus',
        value: '-2',
        mode: MODES.ADD,
        priority: MODES.ADD * 10,
        label: 'A5E.ConditionSlowed'
      },
      ...Object.keys(A5E.movement).map((movementType) => ({
        key: `system.attributes.movement.${movementType}.distance`,
        value: '0.5',
        mode: MODES.MULTIPLY,
        priority: MODES.MULTIPLY * 10,
        label: 'A5E.ConditionSlowed'
      }))
    ],

    strife: [],

    stunned: [
      {
        key: 'flags.a5e.effects.grants.rollMode.attack.all',
        value: 1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionStunned'
      }
    ],

    unconscious: [
      {
        key: 'flags.a5e.effects.grants.rollMode.attack.all',
        value: 1,
        mode: MODES.OVERRIDE,
        priority: MODES.OVERRIDE * 10,
        label: 'A5E.ConditionStunned'
      }
    ]
  };
}

export default function registerConditionsConfig() {
  const { A5E } = CONFIG;
  const MODES = A5E.ACTIVE_EFFECT_MODES;

  const enabledConditions = new Set(
    game.settings.storage.get('world').getItem('a5e.automatedConditions')
  );

  const replaceFatigueAndStrife = game.settings.get('a5e', 'replaceFatigueAndStrife');
  const customIcons = game.settings.get('a5e', 'customConditionIcons');
  const changes = generateChanges(A5E);

  A5E.multiLevelConditionsMaxLevel = {
    corruption: 7,
    fatigue: replaceFatigueAndStrife ? 6 : 7,
    inebriated: 5,
    strife: 7
  };

  A5E.multiLevelConditions = {
    corruption: {
      1: [],
      2: [
       {
         key: 'system.abilities.str.check.bonus',
         value: '-2',
         mode: MODES.ADD,
         priority: MODES.ADD * 10,
         label: 'Corruption 2'
       }
      ],
      3: [],
      4: [
        {
          key: 'flags.a5e.effects.rollMode.abilitySave.con',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Corruption 4'
        }
      ],
      5: [
        {
          key: 'flags.a5e.effects.rollMode.abilitySave.wis',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Corruption 5'
        },
      ],
      6: [
       {
         key: 'system.abilities.cha.value',
         value: '-2',
         mode: MODES.ADD,
         priority: MODES.ADD * 10,
         label: 'Corruption 6'
       },
       {
         key: 'system.traits.damageImmunities',
         value: 'poison',
         mode: MODES.ADD,
         priority: MODES.ADD * 10,
         label: 'Corruption 6'
       },
       {
         key: 'system.traits.damageImmunities',
         value: 'necrotic',
         mode: MODES.ADD,
         priority: MODES.ADD * 10,
         label: 'Corruption 6'
       }
      ],
      7: [
       {
         key: 'system.traits.alignment.0',
         value: 'evil',
         mode: MODES.ADD,
         priority: MODES.ADD * 10,
         label: 'Corruption 7'
       }
      ]
    },
    fatigue: {
      1: [],
      2: [
        {
          key: 'flags.a5e.effects.rollMode.abilityCheck.con',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Fatigue 2'
        },
        {
          key: 'flags.a5e.effects.rollMode.abilityCheck.dex',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Fatigue 2'
        },
        {
          key: 'flags.a5e.effects.rollMode.abilityCheck.str',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Fatigue 2'
        }
      ],
      3: [
        ...Object.keys(A5E.movement).map((movementType) => ({
          key: `system.attributes.movement.${movementType}.distance`,
          value: '0.5',
          mode: MODES.MULTIPLY,
          priority: MODES.MULTIPLY * 10,
          label: 'Fatigue 3'
        }))
      ],
      4: [],
      5: [],
      6: [
        ...Object.keys(A5E.movement).map((movementType) => ({
          key: `system.attributes.movement.${movementType}.distance`,
          value: '{"comparisonOperator":"==","comparisonValue":"0","positiveValue":"0","negativeValue":"5"}',
          mode: MODES.CONDITIONAL,
          priority: MODES.CONDITIONAL * 10,
          label: 'Fatigue 6'
        }))
      ]
    },
    exhaustion: {
      1: [
        {
          key: 'flags.a5e.effects.rollMode.abilityCheck.all',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Exhaustion 1'
        }
      ],
      2: [
        ...Object.keys(A5E.movement).map((movementType) => ({
          key: `system.attributes.movement.${movementType}.distance`,
          value: '0.5',
          mode: MODES.MULTIPLY,
          priority: MODES.MULTIPLY * 10,
          label: 'Exhaustion 2'
        }))
      ],
      3: [
        {
          key: 'flags.a5e.effects.rollMode.savingThrow.all',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Exhaustion 3'
        },
        {
          key: 'flags.a5e.effects.rollMode.attack.all',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Exhaustion 3'
        }
      ],
      4: [
        {
          key: 'system.attributes.hp.max',
          value: '0.5',
          mode: MODES.MULTIPLY,
          priority: MODES.MULTIPLY * 10,
          label: 'Exhaustion 4'
        }
      ],
      5: [
        ...Object.keys(A5E.movement).map((movementType) => ({
          key: `system.attributes.movement.${movementType}.distance`,
          value: '0',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Exhaustion 5'
        }))
      ],
      6: []
    },
    inebriated: {
      1: [],
      2: [],
      3: [
       {
         key: 'system.abilities.dex.value',
         value: '-2',
         mode: MODES.ADD,
         priority: MODES.ADD * 10,
         label: 'Inebriated 3'
       }
      ],
      4: [
       {
          key: 'flags.a5e.effects.rollMode.abilityCheck.cha',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Inebriated 4'
       }
      ],
      5: []
    },
    strife: {
      1: [
        {
          key: 'flags.a5e.effects.rollMode.abilityCheck.cha',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Strife 1'
        },
        {
          key: 'flags.a5e.effects.rollMode.abilityCheck.int',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Strife 1'
        },
        {
          key: 'flags.a5e.effects.rollMode.abilityCheck.wis',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Strife 1'
        }
      ],
      2: [
        {
          key: 'flags.a5e.effects.rollMode.concentration',
          value: '-1',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Strife 2'
        }
      ],
      3: [],
      4: [],
      5: [],
      6: [],
      7: []
    }
  };

  let conditions = [
    // Blinded
    {
      id: 'blinded',
      description: '<ul class="a5e-tooltip__list"><li>A blinded creature can\'t see and it automatically fails ability checks that require sight.</li><li>Attack rolls against a blinded creature are made with advantage, and the creature\'s attack rolls are made with disadvantage.</li></ul>',
      name: 'A5E.ConditionBlinded',
      img: 'icons/svg/blind.svg',
      changes: changes.blinded,
      duration: {}
    },
    // Bloodied
    {
      id: 'bloodied',
      description: '<ul class="a5e-tooltip__list"><li>A creature is bloodied when reduced to half its hit points or less.</li></ul>',
      name: 'A5E.ConditionBloodied',
      img: 'icons/svg/blood.svg',
      changes: changes.bloodied,
      duration: {}
    },
    // Charmed
    {
      id: 'charmed',
      description: '<ul class="a5e-tooltip__list"><li>A charmed creature can\'t take any hostile action against the charmer.</li><li>Ability checks the charmer makes to socially interact with the charmed creature have advantage.</li></ul>',
      name: 'A5E.ConditionCharmed',
      img: 'systems/a5e/assets/icons/charmed.svg',
      changes: changes.charmed,
      duration: {}
    },
    // Concentration
    {
      id: 'concentration',
      description: '<p>A spellcaster\'s concentration can be ended by any of the following:</p><ul><li>The spellcaster chooses to end concentration at any time.</li><li>The spellcaster is incapacitated or killed.</li><li>The spellcaster successfully casts another spell that requires concentration.</li><li>The GM may rule that a sudden interruption, such as a push, may force the spellcaster to make a DC 10 Constitution check. On a failure, the spell ends.</li><li>If the spellcaster takes damage while concentrating on a spell, they must make a Constitution saving throw; on a failure, the spell ends.The DC is 10 or half the damage taken, whichever is higher.</li></ul>',
      name: 'A5E.ConditionConcentration',
      img: 'systems/a5e/assets/icons/concentration.svg',
      changes: changes.concentration,
      duration: {}
    },
    // Confused
    {
      id: 'confused',
      description: '<ul class="a5e-tooltip__list"><li>A confused creature can\'t take reactions.</li><li>On its turn a confused creature rolls a d8 to determine what it does.</li><ul><li>On a 1 to 4, a confused creature does nothing.</li><li>On a 5 or 6, a confused creature takes no action or bonus action and uses all its movement to move in a randomly determined direction.</li><li>On a 7 or 8, a confused creature makes a melee attack against a randomly determined creature within its reach or does nothing if it can\'t make such an attack.</li></ul ></ul >',
      name: 'A5E.ConditionConfused',
      img: 'systems/a5e/assets/icons/confused.svg',
      changes: changes.confused,
      duration: {}
    },
    // Corruption
    {
      id: 'corruption',
      _id: 'corruption000000',
      name: 'A5E.ConditionCorruption',
      img: 'systems/a5e/assets/icons/corruption.svg',
      changes: changes.corruption,
      duration: {}
    },
    // Dazzled
    {
      id: 'dazzled',
      description: '<ul class="a5e-tooltip__list"><li>A dazzled creature has disadvantage on ability checks that require sight.</li><li>A dazzled creature cannot take reactions.</li><li>Creatures that are immune to being blinded are immune to being dazzled.</li><li>If this condition is inflicted by nonmagical environmental means (such as initial exposure to sunlight after being underground for an extended period of time), it persists for 1 round before dissipating.</li></ul>',
      name: 'A5E.ConditionDazzled',
      img: 'systems/a5e/assets/icons/dazzled.svg',
      changes: changes.dazzled,
      duration: {}
    },
    // Deafened
    {
      id: 'deafened',
      description: '<ul class="a5e-tooltip__list"><li>A deafened creature can\'t hear and automatically fails ability checks that require hearing.</li></ul>',
      name: 'A5E.ConditionDeafened',
      img: 'icons/svg/deaf.svg',
      changes: changes.deafened,
      duration: {}
    },
    // Dead
    {
      id: 'dead',
      name: 'EFFECT.StatusDead',
      img: 'icons/svg/skull.svg',
      changes: changes.dead,
      duration: {},
      flags: { core: { overlay: true } }
    },
    // Doomed
    {
      id: 'doomed',
      description: '<ul class="a5e-tooltip__list"><li>A doomed creature dies at a time determined by the Narrator, or within 13 (2d12) hours.</li><li>A doomed creature continues to be doomed even after it dies. Magic equivalent to a 7th-level or higher spell can remove the doomed condition (such as regenerate cast on a living creature, resurrection, true resurrection, or wish).</li></ul >',
      name: 'A5E.ConditionDoomed',
      img: 'systems/a5e/assets/icons/doomed.svg',
      changes: changes.doomed,
      duration: {}
    },
    // Encumbered
    {
      id: 'encumbered',
      description: '<ul class="a5e-tooltip__list"><li>An encumbered creature\'s Speed is reduced to 5 ft.</li></ul>',
      name: 'A5E.ConditionEncumbered',
      img: 'systems/a5e/assets/icons/encumbered.svg',
      changes: changes.encumbered,
      duration: {}
    },
    // Enervated
    {
      id: 'enervated',
      description: '<ul class="a5e-tooltip__list"><li>An enervated creature can\’t use psionic powers or features that require psionic points.</li><li>An enervated creature suffers a –2 penalty on all ability checks, saving throws, and attacks.</li></ul>',
      name: 'A5E.ConditionEnervated',
      img: 'systems/a5e/assets/icons/enervated.svg',
      changes: changes.enervated,
      duration: {}
    },
    // Fatigue
    {
      id: 'fatigue',
      _id: 'fatigue000000000',
      name: 'A5E.ConditionFatigue',
      img: 'systems/a5e/assets/icons/fatigue.svg',
      changes: changes.fatigue,
      duration: {}
    },
    // Fixated
    {
      id: 'fixated',
      description: '<ul class="a5e-tooltip__list"><li>A fixated creature has disadvantage on Investigation and Perception checks to perceive or examine creatures or objects other than the source of its fixation.</li><li>A fixated creature must spend 2 feet of movement for every 1 foot of movement away from the source of its fixation.</li><li>A creature that is immune to being charmed is also immune to being fixated.</li></ul>',
      name: 'A5E.ConditionFixated',
      img: 'systems/a5e/assets/icons/fixated.svg',
      changes: changes.fixated,
      duration: {}
    },
    // Frightened
    {
      id: 'frightened',
      description: '<ul class="a5e-tooltip__list"><li>A frightened creature has disadvantage on ability checks and attack rolls while it is able to see the source of its fear.</li><li>A frightened creature can\'t willingly move closer to the source of its fear.</li></ul>',
      name: 'A5E.ConditionFrightened',
      img: 'icons/svg/terror.svg',
      changes: changes.frightened,
      duration: {}
    },
    // Grappled
    {
      id: 'grappled',
      description: '<ul class="a5e-tooltip__list"><li>A grappled creature\'s Speed becomes 0, and it can\'t benefit from bonuses to movement speeds.</li><li>If the grappler becomes incapacitated the condition ends.</li><li>If an effect removes the grappled creature from the reach of the grappler or grappling effect (such as when a creature is shoved away by the Doubleteam combat maneuver) the condition ends.</li></ul>',
      name: 'A5E.ConditionGrappled',
      img: 'systems/a5e/assets/icons/grappled.svg',
      changes: changes.grappled,
      duration: {}
    },
    // Hungover
    {
      id: 'hungover',
      description: '<ul class="a5e-tooltip__list"><li>Hungover creatures have a –2 penalty to Constitution saving throws until they complete a short or long rest.</li><li>A hungover creature cannot take reactions.</li><li>A hungover creature has disadvantage on Perception checks.</li><li>Creatures that are immune to poison or the poisoned condition cannot be hungover.</li></ul>',
      name: 'A5E.ConditionHungover',
      img: 'systems/a5e/assets/icons/hungover.svg',
      changes: changes.hungover,
      duration: {}
    },
    // Incapacitated
    {
      id: 'incapacitated',
      description: '<ul class="a5e-tooltip__list"><li>An incapacitated creature can\'t take actions, bonus actions, or reactions.</li></ul>',
      name: 'A5E.ConditionIncapacitated',
      img: 'systems/a5e/assets/icons/incapacitated.svg',
      changes: changes.incapacitated,
      duration: {}
    },
    // Inebriated
    {
      id: 'inebriated',
      _id: 'inebriated000000',
      name: 'A5E.ConditionInebriated',
      img: 'systems/a5e/assets/icons/inebriated.svg',
      changes: changes.inebriated,
      duration: {}
    },
    // Invisible
    {
      id: 'invisible',
      description: '<ul class="a5e-tooltip__list"><li>An invisible creature is impossible to see without the aid of magic or a special sense (it gains no benefits from this condition against creatures still able to see it).</li><li>An invisible creature is heavily obscured for the purpose of hiding.</li><li>An invisible creature\'s location can be detected by noises it makes or tracks it leaves.</li><li>Attack rolls against an invisible creature are made with disadvantage.</li><li>An invisible creature makes attack rolls with advantage.</li></ul>',
      name: 'A5E.ConditionInvisible',
      img: 'icons/svg/invisible.svg',
      changes: changes.invisible,
      duration: {}
    },
    // Paralyzed
    {
      id: 'paralyzed',
      _id: 'paralyzed0000000',
      description: '<ul class="a5e-tooltip__list"><li>A paralyzed creature is incapacitated and can\'t move or speak.</li><li>A paralyzed creature automatically fails Strength and Dexterity saving throws.</li><li>Attack rolls against a paralyzed creature have advantage.</li><li>Any attack that hits a paralyzed creature is a critical hit if the attacker is within 5 feet.</li></ul>',
      name: 'A5E.ConditionParalyzed',
      img: 'icons/svg/paralysis.svg',
      changes: changes.paralyzed,
      duration: {},
      statuses: ['incapacitated']
    },
    // Petrified
    {
      id: 'petrified',
      _id: 'petrified0000000',
      description: '<ul class="a5e-tooltip__list"><li>A petrified creature (and all of its mundane possessions) is transformed into a solid inanimate substance (usually stone).</li><li>A petrified creature\'s weight is increased by a factor of ten and it ceases aging.</li><li>A petrified creature is incapacitated, can\'t move or speak, and is unaware of its surroundings.</li><li>A petrified creature automatically fails Strength and Dexterity saving throws.</li><li>A petrified creature has resistance to all damage.</li><li>A petrified creature is immune to poison and disease (time spent petrified does not affect the duration of a poison or disease already in its system).</li></ul>',
      name: 'A5E.ConditionPetrified',
      img: 'systems/a5e/assets/icons/petrified.svg',
      changes: changes.petrified,
      duration: {},
      statuses: ['incapacitated']
    },
    // Poisoned
    {
      id: 'poisoned',
      description: '<ul class="a5e-tooltip__list"><li>A poisoned creature has disadvantage on attack rolls and ability checks.</li></ul>',
      name: 'A5E.ConditionPoisoned',
      img: 'icons/svg/poison.svg',
      changes: changes.poisoned,
      duration: {}
    },
    // Prone
    {
      id: 'prone',
      description: '<ul class="a5e-tooltip__list"><li>A prone creature\'s only movement option is to crawl (every 1 foot of movement while crawling costs 1 extra foot) until it stands up.</li><li>Standing up requires half a creature\'s movement.</li><li>A prone creature makes melee attack rolls with disadvantage.</li><li>An attack roll against a prone creature is made with advantage if the attacker is within 5 feet. Otherwise, the attack roll is made with disadvantage.</li></ul>',
      name: 'A5E.ConditionProne',
      img: 'icons/svg/falling.svg',
      changes: changes.prone,
      duration: {}
    },
    // Rattled
    {
      id: 'rattled',
      description: '<ul class="a5e-tooltip__list"><li>A rattled creature cannot benefit from expertise dice.</li><li>A creature that is immune to being stunned is immune to being rattled.</li><li>A rattled creature cannot take reactions.</li></ul>',
      name: 'A5E.ConditionRattled',
      img: 'systems/a5e/assets/icons/rattled.svg',
      changes: changes.rattled,
      duration: {}
    },
    // Restrained
    {
      id: 'restrained',
      description: '<ul class="a5e-tooltip__list"><li>A restrained creature\'s Speed becomes 0, and it can\'t benefit from bonuses to speed.</li><li>Attack rolls against a restrained creature are made with advantage.</li><li>A restrained creature makes attack rolls with disadvantage.</li><li>The restrained creature has disadvantage on Dexterity saving throws.</li></ul>',
      name: 'A5E.ConditionRestrained',
      img: 'icons/svg/net.svg',
      changes: changes.restrained,
      duration: {}
    },
    // Slowed
    {
      id: 'slowed',
      description: '<ul class="a5e-tooltip__list"><li>A slowed creature\'s Speed is halved.</li><li>A slowed creature takes a −2 penalty to AC and Dexterity saving throws.</li><li>A slowed creature cannot take reactions.</li><li>On its turn, a slowed creature can take either an action or a bonus action, not both. In addition, it can\'t make more than one melee or ranged attack during its turn.</li></ul>',
      name: 'A5E.ConditionSlowed',
      img: 'systems/a5e/assets/icons/slowed.svg',
      changes: changes.slowed,
      duration: {}
    },

    // Strife
    {
      id: 'strife',
      _id: 'strife0000000000',
      name: 'A5E.ConditionStrife',
      img: 'systems/a5e/assets/icons/strife.svg',
      changes: changes.strife,
      duration: {}
    },
    // Stunned
    {
      id: 'stunned',
      _id: 'stunned000000000',
      description: '<ul class="a5e-tooltip__list"><li>A stunned creature is incapacitated (see the condition), can\'t move, and can speak only falteringly.</li><li>The creature automatically fails Strength and Dexterity saving throws.</li><li>Attack rolls against the creature have advantage.</li><li>A creature that is immune to being stunned is immune to being rattled.</li></ul>',
      name: 'A5E.ConditionStunned',
      img: 'icons/svg/daze.svg',
      changes: changes.stunned,
      duration: {},
      statuses: ['incapacitated']
    },
    // Unconscious
    {
      id: 'unconscious',
      _id: 'unconscious00000',
      description: '<ul class="a5e-tooltip__list"><li>An unconscious creature is incapacitated, can\'t move or speak, and is unaware of its surroundings.</li><li>An unconscious creature drops whatever it\'s holding and falls prone.</li><li>An unconscious creature automatically fails Strength and Dexterity saving throws.</li><li>Attack rolls against an unconscious creature are made with advantage.</li><li>Any attack that hits an unconscious creature is a critical hit if the attacker is within 5 feet.</li></ul>',
      name: 'A5E.ConditionUnconscious',
      img: 'icons/svg/unconscious.svg',
      changes: changes.unconscious,
      duration: {},
      flags: {
        core: { overlay: true }
      },
      statuses: ['incapacitated']
    },
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `generic${i + 1}`,
      name: `Generic ${i + 1}`,
      img: `systems/a5e/assets/icons/circle${i + 1}.svg`,
      changes: [],
      duration: {}
    }))
  ];

  conditions = conditions.reduce((acc, condition) => {
    if (replaceFatigueAndStrife && condition.id === 'strife') return acc;

    // Update Icon
    condition.img = customIcons[condition.id]
      || A5E.conditionIconsDefault[condition.id] || condition.img;

    // Add changes based on settings
    if (!enabledConditions.has(condition.id) && condition.changes.length) {
      condition.changes = [];
    }

    if (replaceFatigueAndStrife && condition.id === 'fatigue') {
      condition.changes = A5E.multiLevelConditions?.exhaustion ?? [];
      condition.name = 'Exhaustion';
    }

    acc.push(condition);
    return acc;
  }, []);

  CONFIG.statusEffects = conditions;

  // Add a custom getter for linked properties
  CONFIG.A5E.linkedStatusEffects = conditions.reduce((acc, condition) => {
    if (!condition.statuses?.length) return acc;

    condition.statuses.forEach((status) => {
      acc[status] ??= [];
      acc[status].push(condition.id);
    });

    return acc;
  }, {});
}
