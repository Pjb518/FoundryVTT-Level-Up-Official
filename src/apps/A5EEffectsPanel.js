import { localize } from '#runtime/svelte/helper';
import { SvelteApplication } from '#runtime/svelte/application';

import A5EEffectsPanelComponent from './hud/A5EEffectsPanel.svelte';

export default class A5EEffectsPanel extends SvelteApplication {
  constructor(options = {}) {
    super(foundry.utils.mergeObject(
      options,
      {
        svelte: {
          class: A5EEffectsPanelComponent,
          target: document.body,
          props: {
            HUD: null
          }
        }
      }
    ));

    this.options.svelte.props.HUD = this;
  }

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
      },
      height: 'auto'
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
