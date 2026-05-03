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
  //

  static applyEffects(
    document,
    effects,
    currentPhase,
    nextPhase,
    predicate = () => true,
  ) {
    return {};
  }
}

export { ActiveEffectA5E };
