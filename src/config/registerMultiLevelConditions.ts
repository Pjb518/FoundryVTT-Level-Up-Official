export function registerMultiLevelConditions() {
  const multiLevelConditionsMaxLevel = {
    corruption: 7,
    fatigue: 7,
    exhaustion: 6,
    inebriated: 5,
    strife: 7,
  } as const;

  const multiLevelConditions = {
    // --------------------------------
    //  Corruption
    // --------------------------------
    corruption: {
      1: [],
      2: [
        {
          key: "system.abilities.str.check.bonus",
          value: -2,
          type: "add",
        },
      ],
      3: [],
      4: [
        {
          key: "flags.a5e.effects.rollMode.abilitySave.con",
          value: -1,
          type: "override",
        },
      ],
      5: [
        {
          key: "flags.a5e.effects.rollMode.abilitySave.wis",
          value: -1,
          type: "override",
        },
      ],
      6: [
        {
          key: "system.abilities.cha.value",
          value: -2,
          type: "add",
        },
        {
          key: "system.traits.damageImmunities",
          value: "poison",
          type: "add",
        },
        {
          key: "system.traits.damageImmunities",
          value: "necrotic",
          type: "add",
        },
      ],
      7: [
        {
          key: "system.traits.alignment.0",
          value: "evil",
          type: "add",
        },
      ],
    },

    // --------------------------------
    //  Fatigue
    // --------------------------------
    fatigue: {
      1: [],
      2: [
        {
          key: "flags.a5e.effects.rollMode.abilityCheck.con",
          value: -1,
          type: "override",
        },
        {
          key: "flags.a5e.effects.rollMode.abilityCheck.dex",
          value: -1,
          type: "override",
        },
        {
          key: "flags.a5e.effects.rollMode.abilityCheck.str",
          value: -1,
          type: "override",
        },
      ],
      3: [
        {
          key: "flags.a5e.effects.movement.allDistances",
          value: 0.5,
          type: "multiply",
        },
      ],
      4: [],
      5: [],
      6: [
        {
          key: "flags.a5e.effects.movement.allDistances",
          value: {
            comparisonOperator: "==",
            comparisonValue: 0,
            positiveValue: "0",
            negativeValue: "5",
          },
          type: "conditional",
        },
      ],
    },

    // --------------------------------
    //  Inebriated
    // --------------------------------
    inebriated: {
      1: [],
      2: [],
      3: [
        {
          key: "system.abilities.dex.value",
          value: -2,
          type: "add",
        },
      ],
      4: [
        {
          key: "flags.a5e.effects.rollMode.abilityCheck.cha",
          value: -1,
          type: "override",
        },
      ],
      5: [],
    },

    // --------------------------------
    //  Strife
    // --------------------------------
    strife: {
      1: [
        {
          key: "flags.a5e.effects.rollMode.abilityCheck.cha",
          value: -1,
          type: "override",
        },
        {
          key: "flags.a5e.effects.rollMode.abilityCheck.int",
          value: -1,
          type: "override",
        },
        {
          key: "flags.a5e.effects.rollMode.abilityCheck.wis",
          value: -1,
          type: "override",
        },
      ],
      2: [
        {
          key: "flags.a5e.effects.rollMode.concentration",
          value: -1,
          type: "override",
        },
      ],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
    },

    // --------------------------------
    //  Exhaustion
    // --------------------------------
    exhaustion: {
      1: [
        {
          key: "flags.a5e.effects.rollMode.abilityCheck.all",
          value: -1,
          type: "override",
        },
      ],
      2: [
        {
          key: "flags.a5e.effects.movement.allDistances",
          value: 0.5,
          type: "multiply",
        },
      ],
      3: [
        {
          key: "flags.a5e.effects.rollMode.savingThrow.all",
          value: -1,
          type: "override",
        },
        {
          key: "flags.a5e.effects.rollMode.attack.all",
          value: -1,
          type: "override",
        },
      ],
      4: [
        {
          key: "system.attributes.hp.max",
          value: "0.5",
          type: "multiply",
        },
      ],
      5: [
        {
          key: "flags.a5e.effects.movement.allDistances",
          value: 0,
          type: "override",
        },
      ],
      6: [],
    },
  } as const;

  return {
    multiLevelConditionsMaxLevel,
    multiLevelConditions,
  };
}
