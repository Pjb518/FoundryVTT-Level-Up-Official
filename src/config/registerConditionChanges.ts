export default function registerConditionChanges() {
  const conditionChanges = {
    blinded: [
      {
        key: "flags.a5e.effects.rollMode.attack.all",
        value: -1,
        type: "override",
      },
      {
        key: "flags.a5e.effects.grants.rollMode.attack.all",
        value: 1,
        type: "override",
      },
    ],
    encumbered: [
      {
        key: "flags.a5e.effects.movement.allDistances",
        value: {
          comparisonOperator: "==",
          comparisonValue: "0",
          positiveValue: "0",
          negativeValue: "5",
        },
        type: "conditional",
      },
    ],
    grappled: [
      {
        key: "flags.a5e.effects.movement.allDistances",
        value: 0,
        type: "override",
      },
    ],
    hungover: [
      {
        key: "system.abilities.con.save.bonus",
        value: -2,
        type: "add",
      },
      {
        key: "flags.a5e.effects.rollMode.skillCheck.prc",
        value: -1,
        type: "override",
      },
    ],
    invisible: [
      {
        key: "flags.a5e.effects.rollMode.attack.all",
        value: 1,
        type: "override",
      },
      {
        key: "flags.a5e.effects.grants.rollMode.attack.all",
        value: -1,
        type: "override",
      },
    ],
    paralyzed: [
      {
        key: "flags.a5e.effects.grants.rollMode.attack.all",
        value: -1,
        type: "override",
      },
    ],
    petrified: [
      {
        key: "flags.a5e.damageResistances.all",
        type: "custom",
      },
    ],
    poisoned: [
      {
        key: "flags.a5e.effects.rollMode.attack.all",
        value: -1,
        mode: "override",
      },
      {
        key: "flags.a5e.effects.rollMode.abilityCheck.all",
        value: -1,
        mode: "override",
      },
    ],
    prone: [
      {
        key: "flags.a5e.effects.rollMode.attack.meleeWeapon",
        value: -1,
        type: "override",
      },
    ],
    rattled: [
      {
        key: "flags.a5e.effects.expertiseDice",
        value: 0,
        type: "override",
      },
    ],
    restrained: [
      {
        key: "flags.a5e.effects.grants.rollMode.attack.all",
        value: 1,
        type: "override",
      },
      {
        key: "flags.a5e.effects.rollMode.attack.all",
        value: -1,
        type: "override",
      },
      {
        key: "flags.a5e.effects.rollMode.abilitySave.dex",
        value: -1,
        type: "override",
      },
      {
        key: "flags.a5e.effects.movement.allDistances",
        value: 0,
        type: "override",
      },
    ],
    slowed: [
      {
        key: "system.attributes.ac.changes.bonuses.value",
        value: "-2",
        type: "add",
      },
      {
        key: "system.abilities.dex.save.bonus",
        value: "-2",
        type: "add",
      },
      {
        key: "flags.a5e.effects.movement.allDistances",
        value: "0.5",
        type: "multiply",
      },
    ],
    stunned: [
      {
        key: "flags.a5e.effects.grants.rollMode.attack.all",
        value: 1,
        type: "override",
      },
    ],
    unconscious: [
      {
        key: "flags.a5e.effects.grants.rollMode.attack.all",
        value: 1,
        type: "override",
      },
    ],
  };

  return {
    conditionChanges,
  };
}
