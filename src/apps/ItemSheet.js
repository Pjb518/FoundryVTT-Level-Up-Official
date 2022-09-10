import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import BackgroundSheetComponent from './sheets/BackgroundSheet.svelte';
import ItemSheetComponent from './sheets/ItemSheet.svelte';

export default class ItemSheet extends SvelteApplication {
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
          class: item.type === 'background' ? BackgroundSheetComponent : ItemSheetComponent,
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
      width: 512,
      height: 592,

      svelte: {
        class: ItemSheetComponent,
        target: document.body
      }
    });
  }
}
