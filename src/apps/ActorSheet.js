import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import ActorSheetComponent from './base/ActorSheet.svelte';

export default class ActorSheet extends SvelteApplication {
  /**
   * @inheritDoc
   */
  constructor(actor, options = {}) {
    super(foundry.utils.mergeObject(
      options,
      {
        id: `actor-sheet-${actor.id}`,
        title: actor.name,
        svelte: {
          props: {
            actorDocument: actor
          }
        }
      }
    ));
  }

  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['a5e-sheet'],
      resizable: true,
      minimizable: true,
      width: 780,
      height: 650,

      svelte: {
        class: ActorSheetComponent,
        target: document.body
      }
    });
  }
}
