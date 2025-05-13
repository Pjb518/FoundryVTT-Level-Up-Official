import type { Action } from "#types/action.js";

import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

import ActionSheetComponent from "#view/sheets/ActionSheet.svelte";

export class ActionSheet extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  actionId: string;

  action: Action;

  actor?: Actor;

  item: Item;

  protected root = ActionSheetComponent;

  constructor(item: Item, actionId: string, actor?: Actor, options = {}) {
    // @ts-expect-error
    super({
      classes: ["a5e-sheet", "a5e-sheet--action"],
      position: { width: 555, height: 592 },
      window: { resizable: true },
    });

    this.item = item;
    this.actionId = actionId;
    this.actor = actor;
  }

  static override DEFAULT_OPTIONS = {
    baseApplication: "ActionSheet",
    classes: ["a5e-sheet", "a5e-sheet--action"],
    position: { width: 555, height: 592 },
    window: {
      resizable: true,
      minimizable: true,
    },
  };

  get title() {
    const title = "Action: ";
    return `${title} ${this.action?.name || "New Action"}`;
  }

  protected override async _prepareContext() {
    return {
      action: this.action,
      actionId: this.actionId,
      item: this.item,
      actor: this.actor,
      sheet: this,
    };
  }
}
