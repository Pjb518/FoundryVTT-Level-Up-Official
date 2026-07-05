import { createSubscriber } from "svelte/reactivity";
import { getDeterministicBonus } from "../../dice/getDeterministicBonus.ts";
import evaluateConditional from "./utils/evaluateConditional.ts";

class ActiveEffectA5E extends ActiveEffect {
  #subscribe: () => void;

  constructor(data: any, context = {}) {
    super(data, context);

    this.#subscribe = createSubscriber((update) => {
      const updateEffectHook = Hooks.on(
        "updateActiveEffect",
        (triggeringDocument, _, { diff }) => {
          if (diff === false) return;

          if (triggeringDocument._id === this.id) update();
        },
      );

      return () => {
        Hooks.off("updateActiveEffect", updateEffectHook);
      };
    });
  }

  get reactive() {
    this.#subscribe();

    return this;
  }
  // -------------------------------------------------------
  //  Static Properties
  // -------------------------------------------------------
  static FALLBACK_IMG = "icons/svg/hazard.svg";

  static CHANGE_TYPES = {
    add: {
      label: "EFFECT.CHANGES.TYPES.add",
      defaultPriority: 20,
      handler: null,
      render: null,
    },
    conditional: {
      label: "EFFECT.CHANGES.TYPES.conditional",
      defaultPriority: 50,
      handler: (
        targetDoc: any,
        change: any,
        changes: any,
        { field, replacementData, modifyTarget },
      ) => {
        const operationData = change.value;
        if (!foundry.utils.isPlainObject(operationData)) return null;

        const current =
          field.value ?? foundry.utils.getProperty(targetDoc, change.key) ?? 0;

        let trueValue = getDeterministicBonus(
          operationData.positiveValue,
          replacementData,
        );
        let falseValue = getDeterministicBonus(
          operationData.negativeValue,
          replacementData,
        );

        const compareValue = getDeterministicBonus(
          operationData.comparisonValue ?? "0",
          replacementData,
        );

        const operator = operationData.comparisonOperator ?? "==";

        const result = evaluateConditional(
          current,
          operator,
          compareValue,
          trueValue,
          falseValue,
        );

        if (modifyTarget && result !== undefined) {
          foundry.utils.setProperty(targetDoc, change.key, result);
        }

        changes[change.key] = result;
      },
      render: null,
    },
    custom: {
      label: "EFFECT.CHANGES.TYPES.add",
      defaultPriority: 0,
      handler: null,
      render: null,
    },
    downgrade: {
      label: "EFFECT.CHANGES.TYPES.downgrade",
      defaultPriority: 30,
      handler: null,
      render: null,
    },
    multiply: {
      label: "EFFECT.CHANGES.TYPES.multiply",
      defaultPriority: 10,
      handler: null,
      render: null,
    },
    override: {
      label: "EFFECT.CHANGES.TYPES.override",
      defaultPriority: 60,
      handler: null,
      render: null,
    },
    subtract: {
      label: "EFFECT.CHANGES.TYPES.subtract",
      defaultPriority: 20,
      handler: null,
      render: null,
    },
    upgrade: {
      label: "EFFECT.CHANGES.TYPES.upgrade",
      defaultPriority: 40,
      handler: null,
      render: null,
    },
  };

  // -------------------------------------------------------
  //  Getters
  // -------------------------------------------------------
  get parentItem() {
    if (!(this.parent instanceof Actor)) return null;

    const idRegex = /Item\.([a-zA-Z0-9]+)/;
    const itemId = this.origin?.match(idRegex)?.[1];

    if (!itemId) return null;
    return this.parent.items.get(itemId);
  }

  get isLocked() {
    if (!["Actor", "ActorDelta", "Token"].includes(this.parent.documentName))
      return true;

    if (this.system.effectType === "onUse") return false;

    const { parentItem } = this;
    if (!parentItem || parentItem?.type !== "object") return false;

    return (
      parentItem?.system?.equippedState !== CONFIG.A5E.EQUIPPED_STATES.EQUIPPED
    );
  }
  // -------------------------------------------------------
  //  Apply Methods
  // -------------------------------------------------------
  static applyChange(
    targetDoc,
    change,
    { replacementData = {}, modifyTarget = true },
  ) {
    let field;
    const changes = {};

    console.log("Here");

    if (typeof change.key === "string" && change.key.startsWith("system.")) {
      if (targetDoc.system instanceof foundry.abstract.DataModel) {
        field = targetDoc.system.getFieldForProperty(change.key.slice(7));
      }
    } else {
      field = targetDoc.getFieldForProperty(String(change.key ?? ""));
    }

    const configuredHandler =
      ActiveEffectA5E.CHANGE_TYPES[change.type]?.handler;

    if (typeof configuredHandler === "function") {
      configuredHandler(targetDoc, change, changes, {
        field,
        replacementData,
        modifyTarget,
      });
    } else if (field) {
      changes[change.key] = this.applyChangeField(targetDoc, change, {
        field,
        replacementData,
        modifyTarget,
      });
    } else {
      this._applyChangeUnguided(targetDoc, change, changes, {
        replacementData,
        modifyTarget,
      });
    }

    console.log(changes);

    return changes;
  }

  static applyChangeField(
    targetDoc,
    change,
    { field, replacementData = {}, modifyTarget = true },
  ) {
    field ??= targetDoc.getFieldForProperty(change.key);

    const current = foundry.utils.getProperty(targetDoc, change.key);
    const update = field.applyChange(current, targetDoc, change, {
      replacementData,
    });

    if (modifyTarget && update !== undefined) {
      foundry.utils.setProperty(targetDoc, change.key, update);
    }

    return update;
  }

  static _applyChangeUnguided(
    targetDoc,
    change,
    changes,
    { replacementData = {}, modifyTarget = true },
  ) {
    const { getProperty, getType } = foundry.utils;

    const current = getProperty(targetDoc, change.key) ?? null;
    let targetData = current;

    if (current === null && targetDoc.documentName) {
      const model = game.model[targetDoc.documentName]?.[targetDoc.type] ?? {};
      targetData = getProperty(model, change.key) ?? null;
    }

    const targetType = getType(targetData);

    // Cast the effect change value to the correct type
    let delta;

    try {
      if (["Array", "Set"].includes(targetType)) {
        const innerType = targetData.length
          ? getType(targetData[0])
          : targetData.size
            ? getType(targetData.first())
            : "string";

        delta = this.#castArray(change.value, innerType, replacementData);

        if (targetType === "Set") delta = new Set(delta);
      } else {
        delta = this.#castDelta(change.value, targetType, replacementData);
      }
    } catch (err) {
      const header = change.effect
        ? `Active Effect (${change.effect.uuid}) |`
        : "";
      console.warn(
        `${header} "${change.type}" change to "${change.key}" failed to resolve: ${error.message}`,
      );
      return;
    }

    // Apply the change depending on the application mode
    switch (change.type) {
      case "add":
        super._applyChangeAdd(targetDoc, change, current, delta, changes);
        break;
      case "subtract":
        super._applyChangeSubtract(targetDoc, change, current, delta, changes);
        break;
      case "multiply":
        super._applyChangeMultiply(targetDoc, change, current, delta, changes);
        break;
      case "override":
        super._applyChangeOverride(targetDoc, change, current, delta, changes);
        break;
      case "upgrade":
      case "downgrade":
        super._applyChangeUpgrade(targetDoc, change, current, delta, changes);
        break;
      case "conditional":
        this._applyConditional(targetDoc, change, current, delta, changes);
        break;
      default:
        this._applyChangeCustom(targetDoc, change, current, delta, changes);
        break;
    }

    // Apply all changes to the actor delta
    if (modifyTarget) foundry.utils.mergeObject(targetDoc, changes);
  }

  static #castDelta(raw: any, type: string, replacementData = {}) {
    let delta;
    if (typeof raw === "string")
      raw = super._replaceDataRefs(raw, replacementData);

    if (type === "boolean") delta = !!raw;
    else if (type === "number") delta = Number(raw) || 0;
    else if (type === "string") delta = String(raw);
    else delta = raw;

    return delta;
  }

  static #castArray(data: unknown, type: string, replacementData = {}) {
    const delta = Array.isArray(data) ? data : [data];
    return delta.map((d) => this.#castDelta(d, type, replacementData));
  }

  static _applyChangeCustom(targetDoc, change, current, delta, changes) {}

  // Temporary Migration Hook in for v14

  static #MODES_TO_TYPES = {
    0: "custom",
    1: "multiply",
    2: "add",
    3: "subtract",
    4: "downgrade",
    5: "upgrade",
    6: "override",
    7: "conditional",
  };
}

export { ActiveEffectA5E };
