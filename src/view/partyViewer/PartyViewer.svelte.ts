import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

import PartyViewerComponent from "#view/sheets/PartyViewer.svelte";

export class PartyViewer extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  root = PartyViewerComponent;

  constructor() {
    //@ts-expect-error
    super({
      classes: ["a5e-sheet", "a5e-sheet--party-viewer"],
      position: { width: 672, height: "auto" },
      window: {
        title: "Party Viewer",
        resizable: true,
      },
    });
  }

  async _prepareContext() {
    return {
      settings: game.settings,
      sheet: this,
    };
  }

  /** @inheritdoc */
  close(options?: any) {
    game.a5e.dialogs.partyViewer = null;
    return super.close(options);
  }
}
