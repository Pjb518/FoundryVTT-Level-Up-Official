import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";
import { localize } from "#utils/localization/localize.ts";

import { settings } from "./settings.ts";

import SystemSettingsComponent from "#view/settings/SystemSettings.svelte";

export class SystemSettings extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data: Record<string, any>;

  root = SystemSettingsComponent;

  store = $state();

  public promise = null;

  public resolve = null;

  constructor(options = {}, dialogData = {}) {
    //@ts-expect-error
    super({
      id: "a5e-system-settings",
      classes: ["a5e-sheet", "a5e-sheet--settings"],
      position: { width: 650, height: "auto" },
      window: { title: localize("A5E.settings.title") },
    });

    this.populateSettings();
    this.data = { settings: this.store };

    // @ts-expect-error
    this.promise = new Promise((resolve) => {
      // @ts-expect-error
      this.resolve = resolve;
    });
  }

  async _prepareContext() {
    return {
      ...this.data,
      dialog: this,
    };
  }

  populateSettings() {
    this.store = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = {
          data: setting.options,
          value: game.settings.get(setting.namespace, setting.key),
        };

        return acc;
      },
      {} as Record<string, { data: any; value: any }>,
    );
  }

  static getActiveApp(): SystemSettings {
    // @ts-ignore
    return Object.values(ui.windows).find(
      (app) => app.id === "a5e-system-settings",
    );
  }

  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp();
    if (app) return app.render(false, { focus: true });

    return new Promise((resolve) => {
      // @ts-expect-error
      options.resolve = resolve;

      new this(options, dialogData).render(true, { focus: true });
    });
  }

  submit(results) {
    this.#resolvePromise(results);

    if (results.reload) {
      foundry.utils.debounce(() => window.location.reload(), 250)();
    }

    return super.close();
  }

  #resolvePromise(data): void {
    if (this.resolve) {
      // @ts-expect-error
      this.resolve(data);
    }
  }
}
