import A5E from '../config';

const MODES = CONST.ACTIVE_EFFECT_MODES;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                         Changes
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const changes = {
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
    {
      key: 'system.attributes.movement.burrow',
      value: '5',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionEncumbered'
    },
    {
      key: 'system.attributes.movement.climb',
      value: '5',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionEncumbered'
    },
    {
      key: 'system.attributes.movement.fly',
      value: '5',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionEncumbered'
    },
    {
      key: 'system.attributes.movement.swim',
      value: '5',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionEncumbered'
    },
    {
      key: 'system.attributes.movement.walk',
      value: '5',
      mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
      priority: 20,
      label: 'A5E.ConditionEncumbered'
    }
  ],

  fatigue: [],

  frightened: [],

  grappled: [
    {
      key: 'system.attributes.movement.burrow',
      value: '0',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionGrappled'
    },
    {
      key: 'system.attributes.movement.climb',
      value: '0',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionGrappled'
    },
    {
      key: 'system.attributes.movement.fly',
      value: '0',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionGrappled'
    },
    {
      key: 'system.attributes.movement.swim',
      value: '0',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionGrappled'
    },
    {
      key: 'system.attributes.movement.walk',
      value: '0',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionGrappled'
    }
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
    {
      key: 'system.attributes.movement.burrow',
      value: '0',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionRestrained'
    },
    {
      key: 'system.attributes.movement.climb',
      value: '0',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionRestrained'
    },
    {
      key: 'system.attributes.movement.fly',
      value: '0',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionRestrained'
    },
    {
      key: 'system.attributes.movement.swim',
      value: '0',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionRestrained'
    },
    {
      key: 'system.attributes.movement.walk',
      value: '0',
      mode: MODES.OVERRIDE,
      priority: MODES.OVERRIDE * 10,
      label: 'A5E.ConditionRestrained'
    }
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
      key: `system.attributes.movement.${movementType}`,
      value: 0.5,
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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                        Flags
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const flags = {
  blinded: {
    conditions: []
  },

  bloodied: {
    conditions: []
  },

  charmed: {
    conditions: []
  },

  concentration: {
    conditions: []
  },

  confused: {
    conditions: []
  },

  deafened: {
    conditions: []
  },

  dead: {
    conditions: []
  },

  doomed: {
    conditions: []
  },

  encumbered: {
    conditions: []
  },

  fatigue: {
    conditions: []
  },

  frightened: {
    conditions: []
  },

  grappled: {
    conditions: []
  },

  incapacitated: {
    conditions: []
  },

  paralyzed: {
    conditions: ['incapacitated']
  },

  petrified: {
    conditions: ['incapacitated']
  },

  poisoned: {
    conditions: []
  },

  prone: {
    conditions: []
  },

  rattled: {
    conditions: []
  },

  restrained: {
    conditions: []
  },

  slowed: {
    conditions: []
  },

  strife: {
    conditions: []
  },

  stunned: {
    conditions: ['incapacitated']
  },

  unconscious: {
    conditions: ['incapacitated']
  }
};
