import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

import ActorSheetComponent from "#view/sheets/ActorSheet.svelte";

export default class ActorSheet extends SvelteApplicationMixin(
  foundry.applications.sheets.ActorSheetV2,
) {
  public actor: any;

  declare public options: any;

  public tempSettings: any;

  protected root;

  constructor(actor: { document: any }, options: any = {}) {
    let root;

    if (
      [
        CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
        CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
        // @ts-expect-error
      ].includes(actor.permission)
    ) {
      options.classes = [
        "a5e-sheet",
        "a5e-sheet--actor",
        "a5e-sheet--actor-limited",
      ];
      options.position = { width: 512, height: "auto" };
      options.window = { resizable: false };
      root = null;
    } else {
      root = ActorSheetComponent;
    }

    super(
      // @ts-expect-error
      foundry.utils.mergeObject(options, {
        document: actor.document,
      }),
    );

    this.root = root;
    this.actor = actor.document.isToken
      ? actor.document.parent?.actor
      : actor.document;
  }

  static override DEFAULT_OPTIONS = {
    baseApplication: "ActorSheet",
    classes: ["a5e-sheet", "a5e-sheet--actor"],
    position: { width: 755, height: 706 },
    window: {
      resizable: true,
      minimizable: true,
    },
  };

  protected override async _prepareContext() {
    return {
      actor: this.actor,
      reducers: this.reducers,
      sheet: this,
    };
  }
}
