// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                         Changes
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const changes = {
  blinded: [],

  encumbered: [{
    key: 'system.attributes.movement.walk',
    value: '5',
    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
    label: 'A5E.ConditionEncumbered'
  }],

  fatigue: [],

  frightened: [],

  grappled: [{
    key: 'system.attributes.movement.walk',
    value: '0',
    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
    label: 'A5E.ConditionGrappled'
  }],

  invisible: [],

  paralyzed: [],

  // FIXME: Dynamically generate the resistance to all damage.
  petrified: [{
    key: 'system.traits.damageResistances',
    value: 'acid',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'bludgeoning',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'cold',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'fire',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'force',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'lightning',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'necrotic',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'piercing',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'poision',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'psychic',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'radiant',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'slashing',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageResistances',
    value: 'thunder',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  },
  {
    key: 'system.traits.damageImmunities',
    value: 'poison',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionPetrified'
  }],

  poisoned: [],

  prone: [],

  rattled: [],

  restrained: [{
    key: 'system.attributes.movement.walk',
    value: '0',
    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
    label: 'A5E.ConditionRestrained'
  }],

  slowed: [{
    key: 'system.attributes.movement.walk',
    value: '0.5',
    mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
    label: 'A5E.ConditionSlowed'
  },
  {
    key: 'system.attributes.ac',
    value: '-2',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    label: 'A5E.ConditionSlowed'
  }],

  strife: [],

  stunned: [],

  unconscious: []

};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                        Flags
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const flags = {
  blinded: {
    conditions: [],
    rollModifiers: {}
  },

  encumbered: {
    conditions: [],
    rollModifiers: {}
  },

  fatigue: {
    conditions: [],
    rollModifiers: {}
  },

  frightened: {
    conditions: [],
    rollModifiers: {}
  },

  grappled: {
    conditions: [],
    rollModifiers: {}
  },

  invisible: {
    conditions: [],
    rollModifiers: {}
  },

  paralyzed: {
    conditions: [],
    rollModifiers: {}
  },

  petrified: {
    conditions: [],
    rollModifiers: {}
  },

  poisoned: {
    conditions: [],
    rollModifiers: {}
  },

  prone: {
    conditions: [],
    rollModifiers: {}
  },

  rattled: {
    conditions: [],
    rollModifiers: {}
  },

  restrained: {
    conditions: [],
    rollModifiers: {}
  },

  slowed: {
    conditions: [],
    rollModifiers: {}
  },

  strife: {
    conditions: [],
    rollModifiers: {}
  },

  stunned: {
    conditions: [],
    rollModifiers: {}
  },

  unconscious: {
    conditions: [],
    rollModifiers: {}
  }
};
