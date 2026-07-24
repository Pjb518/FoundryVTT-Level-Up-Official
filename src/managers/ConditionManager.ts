import { getStaticId } from "#utils/getStaticId.ts";
import { localize } from "#utils/localization/localize.ts";

export interface Condition {
  _id: string;
  id: string;
  name: string;
  description: string;
  img: string;
  statuses: string[];
  stackable: boolean;
  changes: any[];
  enriched: string;
}

class ConditionManager {
  #conditions: Map<string, Condition>;

  #ready: boolean;

  constructor() {
    this.#conditions = new Map();
    this.#ready = false;
  }

  /* ---------------------------------------------------------
    Setup
	--------------------------------------------------------- */

  init() {
    const conditions = Object.keys(CONFIG.A5E.conditions);

    const customIcons = game.settings.get(
      "a5e",
      "customConditionIcons",
    ) as Record<string, string>;

    conditions.forEach(async (c) => {
      const _id = getStaticId(c);

      const id = c;
      const name = CONFIG.A5E.conditions[id];
      const img = customIcons[id] || CONFIG.A5E.conditionIconsDefault[id];
      const description = CONFIG.A5E.conditionDescriptions[id];
      const statuses = CONFIG.A5E.conditionLinkedConditions[id] ?? [];
      const stackable = CONFIG.A5E.conditionStackableConditions[id];
      const changes = CONFIG.A5E.conditionChanges[id] ?? [];

      const data = {
        _id,
        id,
        name,
        img,
        description,
        statuses,
        stackable,
        changes,
      } as Condition;

      // Add an enriched version of the condition to the data
      // try {
      //   console.log("Here");
      //   data.enriched =
      //     (await foundry.applications.ux?.TextEditor?.implementation?.enrichHTML?.(
      //       `[[/condition condition=${id}]]`,
      //     )) || `[[/condition condition=${id}]]`;
      // } catch (_error) {
      //   console.error(_error);
      //   data.enriched =
      //     await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      //       `[[/condition condition=${id}]]`,
      //     );
      // }

      this.#conditions.set(id, data);
    });

    // Setup exhaustion
    const replaceFatigue = game.settings.get("a5e", "replaceFatigueAndStrife");

    if (replaceFatigue) {
      this.#conditions.delete("strife");
      const fatigue = this.#conditions.get("fatigue")!;

      fatigue.description = CONFIG.A5E.conditionDescriptions["exhaustion"];
      fatigue.name = CONFIG.A5E.conditions["exhaustion"];
      fatigue.statuses = [];
      fatigue.changes = [];
      this.#conditions.set("fatigue", fatigue);
    }

    this.#ready = true;
  }

  configureStatusEffects() {
    if (!this.#ready) throw Error("Conditions are not ready yet.");

    const statusEffects = [...this.#conditions.values()].sort((a, b) => {
      const aid = a.name !== undefined ? localize(a.name) : a.id || a;
      const bid = b.name !== undefined ? localize(b.name) : b.id || b;

      return aid > bid ? 1 : aid < bid ? -1 : 0;
    });

    CONFIG.statusEffects.length = 0;
    CONFIG.statusEffects.push(...statusEffects);
  }

  /* ---------------------------------------------------------
	   Getters
	--------------------------------------------------------- */
  get conditions() {
    return this.#conditions;
	}

  get(conditionId: string): Condition | undefined {
    return this.#conditions.get(conditionId);
  }

  getActorConditions(actor: Actor) {
    const effects = [...actor.effects];
    return effects.filter((e) => e.system.effectType === "condition");
  }

  /* ---------------------------------------------------------
    Complex Condition Helpers
	--------------------------------------------------------- */
}

export { ConditionManager };
