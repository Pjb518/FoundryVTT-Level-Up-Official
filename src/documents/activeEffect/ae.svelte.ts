import { createSubscriber } from "svelte/reactivity";

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

  // -------------------------------------------------------
  //  Getters
  // -------------------------------------------------------

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
      configuredHandler(targetDoc, change, {
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

  static override migrateData(source) {
    if (source.name.includes("Anti-Grav")) {
      console.error("Break");
    }
    const originalChanges = foundry.utils.duplicate(source.changes);
    console.log("original", originalChanges);
    // const updatedSource = super.migrateData(source) as any;
    const updatedSource = {};
    updatedSource.changes = originalChanges;

    if (Array.isArray(updatedSource.changes)) {
      updatedSource.system ??= {};
      this._addDataFieldMigration(updatedSource, "changes", "system.changes");
      if (Array.isArray(updatedSource.system.changes)) {
        for (const change of updatedSource.system.changes) {
          if (
            !Object.hasOwn(change, "type") &&
            typeof change.mode === "number"
          ) {
            change.type =
              ActiveEffectA5E.#MODES_TO_TYPES[change.mode] ??
              `custom.${change.mode}`;
            delete change.mode;
          }
          if (
            foundry.utils.isPlainObject(change) &&
            typeof change.value === "string"
          ) {
            change.value = ActiveEffectA5E.#migrateChangeValue(change.value);
          }
        }
      }
    }

    return updatedSource;
  }

  /**
   * Migrate a single change value
   * @param {unknown} value
   * @returns {SerializableBuiltin}
   */
  static #migrateChangeValue(value) {
    if (typeof value !== "string" || value === "") return value;
    try {
      return ActiveEffectA5E.#migrateChangeValue(JSON.parse(value));
    } catch {
      return value;
    }
  }
}

export { ActiveEffectA5E };
