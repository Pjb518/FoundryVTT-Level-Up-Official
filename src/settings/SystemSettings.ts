import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import { gameSettings } from './SettingsStore';

import SystemSettingsComponent from '../apps/settings/SystemSettings.svelte';

export default class SystemSettings extends SvelteApplication {
  promise = null;

  resolve = null;

  constructor(options = {}, dialogData = {}) {
    super({
      id: 'a5e-system-settings',
      title: localize('A5E.settings.title'),
      svelte: {
        class: SystemSettingsComponent,
        target: document.body,
        props: {
          settings: gameSettings
        }
      },
      width: 600,
      height: 800,
      ...options
    }, { dialogData });

    // @ts-ignore
    this.options.svelte.props.dialog = this;

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
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

  submit(results) {
    this.#resolvePromise(results);
    // @ts-ignore
    if (results.reload) foundry.utils.debounce(() => window.location.reload(), 250)();
    return super.close();
  }

  #resolvePromise(data) {
    if (this.resolve) {
      this.resolve(data);
    }
  }
}
