import { getStaticId } from "#utils/getStaticId.ts";

export interface Condition {
  _id: string;
  id: string;
  name: string;
  description: string;
  img: string;
  statuses: string[];
  stackable: boolean;
  enriched: string;
}

class ConditionsManager {
  #conditions: Map<string, Condition>;

  #ready: boolean;

  constructor() {
    this.#conditions = new Map();
    this.#ready = false;
  }

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
      const statuses = CONFIG.A5E.conditionLinkedConditions[id];
      const stackable = CONFIG.A5E.conditionStackableConditions[id];

      const data = {
        id,
        name,
        img,
        description,
        statuses,
        stackable,
      } as Condition;

      this.#conditions.set(id, data);
    });

    this.#ready = true;
  }
}

export { ConditionsManager };
