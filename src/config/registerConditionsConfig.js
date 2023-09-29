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

    deafened: [],

    dead: [],

    doomed: [],

    encumbered: [
      ...Object.keys(A5E.movement).map((type) => (
        {
          key: `system.attributes.movement.${type}.distance`,
          value: '5',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'A5E.ConditionGrappled'
        }))
    ],

    fatigue: [],

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

    incapacitated: [],

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
        key: 'system.attributes.ac',
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

export default function registerConditionsConfig(A5E) {
  const MODES = A5E.ACTIVE_EFFECT_MODES;

  const enabledConditions = new Set(
    game.settings.storage.get('world').getItem('a5e.automatedConditions')
  );

  const changes = generateChanges(A5E);

  A5E.multiLevelConditionsMaxLevel = {
    fatigue: 7,
    strife: 7
  };

  A5E.multiLevelConditions = {
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
          value: '5',
          mode: MODES.OVERRIDE,
          priority: MODES.OVERRIDE * 10,
          label: 'Fatigue 6'
        }))
      ]
    },
    exhaustion: {

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

  return [
    // Blinded
    {
      id: 'blinded',
      label: 'A5E.ConditionBlinded',
      icon: 'icons/svg/blind.svg',
      changes: changes.blinded,
      duration: {}
    },
    // Bloodied
    {
      id: 'bloodied',
      label: 'A5E.ConditionBloodied',
      icon: 'icons/svg/blood.svg',
      changes: changes.bloodied,
      duration: {}
    },
    // Charmed
    {
      id: 'charmed',
      label: 'A5E.ConditionCharmed',
      icon: 'systems/a5e/assets/icons/charmed.svg',
      changes: changes.charmed,
      duration: {}
    },
    // Concentration
    {
      id: 'concentration',
      label: 'A5E.ConditionConcentration',
      icon: 'systems/a5e/assets/icons/concentration.svg',
      changes: changes.concentration,
      duration: {}
    },
    // Confused
    {
      id: 'confused',
      label: 'A5E.ConditionConfused',
      icon: 'systems/a5e/assets/icons/confused.svg',
      changes: changes.confused,
      duration: {}
    },
    // Deafened
    {
      id: 'deafened',
      label: 'A5E.ConditionDeafened',
      icon: 'icons/svg/deaf.svg',
      changes: changes.deafened,
      duration: {}
    },
    // Dead
    {
      id: 'dead',
      label: 'EFFECT.StatusDead',
      icon: 'icons/svg/skull.svg',
      changes: changes.dead,
      duration: {},
      flags: { core: { overlay: true } }
    },
    // Doomed
    {
      id: 'doomed',
      label: 'A5E.ConditionDoomed',
      icon: 'systems/a5e/assets/icons/doomed.svg',
      changes: changes.doomed,
      duration: {}
    },
    // Encumbered
    {
      id: 'encumbered',
      label: 'A5E.ConditionEncumbered',
      icon: 'systems/a5e/assets/icons/encumbered.svg',
      changes: changes.encumbered,
      duration: {}
    },
    // Fatigue
    {
      id: 'fatigue',
      label: 'A5E.ConditionFatigue',
      icon: 'systems/a5e/assets/icons/fatigue.svg',
      changes: changes.fatigue,
      duration: {}
    },
    // Frightened
    {
      id: 'frightened',
      label: 'A5E.ConditionFrightened',
      icon: 'icons/svg/terror.svg',
      changes: changes.frightened,
      duration: {}
    },
    // Grappled
    {
      id: 'grappled',
      label: 'A5E.ConditionGrappled',
      icon: 'systems/a5e/assets/icons/grappled.svg',
      changes: changes.grappled,
      duration: {}
    },
    // Incapacitated
    {
      id: 'incapacitated',
      label: 'A5E.ConditionIncapacitated',
      icon: 'systems/a5e/assets/icons/incapacitated.svg',
      changes: changes.incapacitated,
      duration: {}
    },
    // Invisible
    {
      id: 'invisible',
      label: 'A5E.ConditionInvisible',
      icon: 'icons/svg/invisible.svg',
      changes: changes.invisible,
      duration: {}
    },
    // Paralyzed
    {
      id: 'paralyzed',
      label: 'A5E.ConditionParalyzed',
      icon: 'icons/svg/paralysis.svg',
      changes: changes.paralyzed,
      duration: {},
      statuses: ['incapacitated']
    },
    // Petrified
    {
      id: 'petrified',
      label: 'A5E.ConditionPetrified',
      icon: 'systems/a5e/assets/icons/petrified.svg',
      changes: changes.petrified,
      duration: {},
      statuses: ['incapacitated']
    },
    // Poisoned
    {
      id: 'poisoned',
      label: 'A5E.ConditionPoisoned',
      icon: 'icons/svg/poison.svg',
      changes: changes.poisoned,
      duration: {}
    },
    // Prone
    {
      id: 'prone',
      label: 'A5E.ConditionProne',
      icon: 'icons/svg/falling.svg',
      changes: changes.prone,
      duration: {}
    },
    // Rattled
    {
      id: 'rattled',
      label: 'A5E.ConditionRattled',
      icon: 'systems/a5e/assets/icons/rattled.svg',
      changes: changes.rattled,
      duration: {}
    },
    // Restrained
    {
      id: 'restrained',
      label: 'A5E.ConditionRestrained',
      icon: 'icons/svg/net.svg',
      changes: changes.restrained,
      duration: {}
    },
    // Slowed
    {
      id: 'slowed',
      label: 'A5E.ConditionSlowed',
      icon: 'systems/a5e/assets/icons/slowed.svg',
      changes: changes.slowed,
      duration: {}
    },

    // Strife
    {
      id: 'strife',
      label: 'A5E.ConditionStrife',
      icon: 'systems/a5e/assets/icons/strife.svg',
      changes: changes.strife,
      duration: {}
    },
    // Stunned
    {
      id: 'stunned',
      label: 'A5E.ConditionStunned',
      icon: 'icons/svg/daze.svg',
      changes: changes.stunned,
      duration: {},
      statuses: ['incapacitated']
    },
    // Unconscious
    {
      id: 'unconscious',
      label: 'A5E.ConditionUnconscious',
      icon: 'icons/svg/unconscious.svg',
      changes: changes.unconscious,
      duration: {},
      flags: {
        core: { overlay: true }
      },
      statuses: ['incapacitated']
    },
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `generic${i + 1}`,
      label: `Generic ${i + 1}`,
      icon: `systems/a5e/assets/icons/circle${i + 1}.svg`,
      changes: [],
      duration: {}
    }))
  ].map((condition) => {
    // Update Icon
    condition.icon = A5E.ConditionIcons[condition.id] ?? condition.icon;

    // Add changes based on settings
    if (!enabledConditions.has(condition.id) && condition.changes.length) {
      condition.changes = [];
    }

    return condition;
  });
}
