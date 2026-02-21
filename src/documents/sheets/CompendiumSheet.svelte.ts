import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

import CompendiumSheetComponent from "#view/sheets/CompendiumSheet.svelte";

export class CompendiumSheet extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  public pack: any;

  protected root = CompendiumSheetComponent;

  constructor({ collection }, options = {}) {
    console.log(collection);

    options = foundry.utils.mergeObject(options, {
      ...CompendiumSheet.DEFAULT_OPTIONS,
      window: {
        ...CompendiumSheet.DEFAULT_OPTIONS.window,
        title: `${collection.metadata.label} ${collection.locked ? "[LOCKED]" : ""}`,
      },
    });

    super(options);

    this.pack = collection;
    this.options = options;
  }

  static override DEFAULT_OPTIONS = {
    classes: ["application", "a5e-sheet", "a5e-sheet--compendium"],
    position: { width: 560, height: "auto" },
    tag: "form",
    window: {
      contentClasses: ["standard-form"],
      contentTag: "main",
      frame: true,
      positioned: true,
      resizable: true,
      minimizable: true,
    },
  };

  protected override async _prepareContext() {
    const compendiumType = "";
    const customImporter = this.options.importer ?? null;

    return {
      compendiumType,
      customImporter,
      pack: this.pack,
      sheet: this,
    };
  }
}
