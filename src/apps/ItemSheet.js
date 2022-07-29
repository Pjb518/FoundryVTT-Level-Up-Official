import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import ItemSheetComponent from './base/ItemSheet.svelte';

export default class ActorSheet extends SvelteApplication {
  /**
   * @inheritDoc
   */
  constructor(item, options = {}) {
    super(foundry.utils.mergeObject(
      options,
      {
        id: `item-sheet-${item.id}`,
        title: item.name,
        svelte: {
          props: {
            itemDocument: item
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
      width: 752,
      height: 672,

      svelte: {
        class: ItemSheetComponent,
        target: document.body
      }
    });
  }
}
