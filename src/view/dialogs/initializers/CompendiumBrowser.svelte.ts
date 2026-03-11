import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

import CompendiumBrowserComponent from "../compendium-browser/CompendiumBrowser.svelte";

export class CompendiumBrowser extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data: Record<string, any>;

  protected root: any;

  constructor(
    data: Record<string, any> = {},
    options: Record<string, any> = {},
  ) {
    // @ts-expect-error
    super({
      classes: ["a5e-sheet", "a5e-sheet--compendium-browser"],
      position: {
        width: options.width ?? 700,
        height: options.height ?? "auto",
      },
      window: { title: "Compendium Browser" },
    });

    this.data = data;
    this.document = document;
    this.root = CompendiumBrowserComponent;
    this.#prepareData();
  }

  static override DEFAULT_OPTIONS = {
    classes: ["a5e-sheet", "a5e-sheet--compendium-browser"],
    position: { width: 700, height: "auto" },
  };

  override async _prepareContext() {
    return {
      ...this.data,
    };
  }

  #prepareData() {}
}
