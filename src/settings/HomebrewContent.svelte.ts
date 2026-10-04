import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";
import { localize } from "#utils/localization/localize.ts";

import HomebrewContentComponent from "#view/settings/HomebrewContent.svelte";

export class HomebrewContent extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  root = HomebrewContentComponent;

  constructor() {
    //@ts-expect-error
    super({
      id: "a5e-homebrew-content",
      classes: ["a5e-sheet", "a5e-sheet--settings"],
      position: { width: 500, height: "auto" },
      window: { title: localize("A5E.settings.homebrewContent") },
    });
  }

  async _prepareContext() {
    return { dialog: this };
  }

  static getActiveApp(): HomebrewContent {
    // @ts-ignore
    return Object.values(ui.windows).find(
      (app) => app.id === "a5e-homebrew-content",
    );
  }

  static async show() {
    const app = this.getActiveApp();
    if (app) return app.render(false, { focus: true });

    return new this().render(true, { focus: true });
  }
}
