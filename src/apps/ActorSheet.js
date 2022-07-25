import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import ActorSheetComponent from './base/ActorSheet.svelte';

export default class ActorSheet extends SvelteApplication {
  /**
   * @inheritDoc
   */
  constructor(options = {}) {
    super(options);

    this.actorId = options.id;
  }

  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: this.actorId,
      resizable: true,
      minimizable: true,
      width: 400,
      height: 'auto',
      title: 'Character Sheet Test',

      svelte: {
        class: ActorSheetComponent,
        target: document.body,
        props: function () {
          return { actorId: this.actorId };
        }
      }
    });
  }
}
