import { localize } from "#runtime/util/i18n";
import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

import ActiveEffectConfigSheet from "./sheets/ActiveEffectConfig.svelte";
import { SvelteApplicationMixin } from "../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

export default class ActiveEffectConfigA5e extends SvelteApplicationMixin(
  foundry.applications.api.DocumentSheetV2,
) {
  data;

  root = ActiveEffectConfigSheet;

  /**
   * @inheritDoc
   */
  constructor(activeEffect, options = {}) {
    super({
      classes: ["a5e-sheet", "a5e-sheet--active-effect"],
      document: activeEffect.document,
      position: { width: 555, height: 500 },
      window: { resizeable: true },
    });

    this.activeEffect = activeEffect.document;

    // Add Status Effects
    this.statusEffectList = {};
    const effectList = CONFIG.statusEffects
      .filter((effect) => effect.id)
      .map((effect) => ({ id: effect.id, label: localize(effect.label) }))
      .sort((a, b) => (a.label < b.label ? -1 : 1));

    effectList.forEach((effect) => {
      this.statusEffectList[effect.id] = effect.label;
    });

    const usableOptions =
      activeEffect.parent?.documentName === "Actor"
        ? game.a5e.activeEffects.options[this.activeEffect.parent.type]
        : game.a5e.activeEffects.options.all;

    this.optionsList = usableOptions.allOptions;
  }

  static DEFAULT_OPTIONS = {
    baseApplication: "ActiveEffectConfig",
    classes: ["a5e-sheet", "a5e-sheet--active-effect"],
    position: { width: 555, height: 500 },
    window: {
      minimizable: true,
      resizable: true,
    },
  };

  async _prepareContext() {
    return {
      document: new TJSDocument(this.activeEffect, {
        delete: this.close.bind(this),
      }),
      sheet: this,
    };
  }

  get isActorEffect() {
    return this.activeEffect?.parent.documentName === "Actor";
  }

  get isActionEffect() {
    return this.activeEffect?.parent.documentName === "Action";
  }

  get isItemEffect() {
    return this.activeEffect?.parent.documentName === "Item";
  }
}
