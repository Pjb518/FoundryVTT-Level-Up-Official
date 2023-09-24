import { SvelteApplication } from '#runtime/svelte/application';

import HelpAndSupportDialogComponent from '../HelpAndSupportDialog.svelte';

export default class HelpAndSupportDialog extends SvelteApplication {
  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: 'Help and Support',
      height: 'auto',
      width: 400,
      classes: ['a5e-help-and-support-dialog'],
      resizable: true,

      svelte: {
        class: HelpAndSupportDialogComponent,
        target: document.body
      }
    });
  }
}
