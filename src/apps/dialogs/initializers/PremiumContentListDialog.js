import { SvelteApplication } from '#runtime/svelte/application';

import PremiumContentListDialogComponent from '../PremiumContentListDialog.svelte';

export default class PremiumContentListDialog extends SvelteApplication {
  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: 'Premium Content',
      height: 'auto',
      width: 500,
      classes: ['a5e-premium-content-list-dialog'],
      resizable: true,

      svelte: {
        class: PremiumContentListDialogComponent,
        target: document.body
      }
    });
  }
}
