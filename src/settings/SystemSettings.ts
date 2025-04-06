import { localize } from "#runtime/util/i18n";
import { SvelteApplicationMixin } from "../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

import { gameSettings } from "./SettingsStore";

import SystemSettingsComponent from "../apps/settings/SystemSettings.svelte";

export default class SystemSettings extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data: Record<string, any>;

  root = SystemSettingsComponent;

  public promise = null;

  public resolve = null;

  constructor(options = {}, dialogData = {}) {
    super({
      id: "a5e-system-settings",
      classes: ["a5e-sheet", "a5e-settings-sheet"],
      position: { width: 650, height: "auto" },
      window: { title: localize("A5E.settings.title") },
    });

    this.data = { settings: gameSettings };

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

  static getActiveApp(): SystemSettings {
    // @ts-ignore
    return Object.values(ui.windows).find(
      (app) => app.id === "a5e-system-settings",
    );
  }

  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp();
    // @ts-expect-error
    if (app) return app.render(false, { focus: true });

    return new Promise((resolve) => {
      // @ts-expect-error
      options.resolve = resolve;

      // @ts-expect-error
      new this(options, dialogData).render(true, { focus: true });
    });
  }

  submit(results) {
    this.#resolvePromise(results);

    if (results.reload) {
      foundry.utils.debounce(() => window.location.reload(), 250)();
    }

    // @ts-expect-error
    return super.close();
  }

  #resolvePromise(data): void {
    if (this.resolve) {
      // @ts-expect-error
      this.resolve(data);
    }
  }
}
