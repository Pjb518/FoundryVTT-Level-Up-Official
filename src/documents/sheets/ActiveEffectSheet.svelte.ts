import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

import { localize } from "#utils/localization/localize.ts";

import Sheet from "#view/sheets/ActiveEffectSheet.svelte";

export default class ActiveEffectSheetA5e extends SvelteApplicationMixin(
  foundry.applications.api.DocumentSheetV2,
) {
  data;

  protected root = Sheet;

  constructor(activeEffect: { document: ActiveEffect }, options = {}) {
    // @ts-expect-error
    super({
      document: activeEffect.document,
      classes: ["a5e-sheet", "a5e-sheet--effect"],
      position: { width: 555, height: 500 },
      window: {
        resizable: true,
      },
    });

    this.activeEffect = activeEffect.document;

    // Add Status Effects
    this.statusEffectList = {};
    const effectList = CONFIG.statusEffects
      .filter((effect) => effect.id)
      .map((effect) => ({ id: effect.id, label: localize(effect.name) }))
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

  static override DEFAULT_OPTIONS = {
    baseApplication: "ActiveEffectConfig",
    classes: ["a5e-sheet", "a5e-sheet--active-effect"],
    position: { width: 555, height: 500 },
    window: {
      minimizable: true,
      resizable: true,
    },
  };

  override async _prepareContext() {
    return {
      document: this.activeEffect,
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
