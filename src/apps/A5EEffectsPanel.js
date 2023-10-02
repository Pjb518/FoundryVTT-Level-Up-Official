import { localize } from '#runtime/svelte/helper';
import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
import { SvelteApplication } from '#runtime/svelte/application';

import A5EEffectsPanelComponent from './hud/A5EEffectsPanel.svelte';

export default class A5EEffectsPanel extends SvelteApplication {
  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      id: 'a5e-effects-panel',
      classes: [],
      popOut: false,
      svelte: {
        class: A5EEffectsPanelComponent,
        target: document.body
      }
    };
  }

  get token() {
    return canvas.tokens.controlled.at(0)?.document ?? null;
  }

  get actor() {
    return this.token?.actor ?? game.user?.character ?? null;
  }

  refresh = foundry.utils.debounce(this.render, 100);
}
