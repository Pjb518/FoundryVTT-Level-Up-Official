import { SvelteApplication, TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import SystemSettingsComponent from '../apps/settings/SystemSettings.svelte';

export default class SystemSettings extends SvelteApplication {
  constructor(options = {}, dialogData = {}) {
    super({
      id: 'a5e-system-settings',
      title: localize('A5E.settings.title'),
      svelte: {
        class: SystemSettingsComponent,
        target: document.body
      },
      width: 600,
      height: 800,
      ...options
    }, { dialogData });
  }

  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
   */
  static get defaultOptions() {
    // @ts-ignore
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['a5e-sheet'],
      minimizable: true,
      svelte: {
        target: document.body
      },
      token: null
    });
  }

  static getActiveApp(): SystemSettings {
    // @ts-ignore
    return Object.values(ui.windows).find((app) => app.id === 'a5e-system-settings');
  }

  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp();
    if (app) return app.render(false, { focus: true });

    return new Promise((resolve) => {
      // @ts-ignore
      options.resolve = resolve;
      new this(options, dialogData).render(true, { focus: true });
    });
  }
}
