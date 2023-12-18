import { SvelteApplication } from '#runtime/svelte/application';

import CompendiumSheetComponent from './sheets/CompendiumSheet.svelte';
import ItemCompendiumFilterStore from '../stores/ItemCompendiumFilterStore';

export default class MagicItemCompendiumSheet extends SvelteApplication {
  constructor(compendiumCollection, options = {}) {
    const { collection } = compendiumCollection;
    super(foundry.utils.mergeObject(options, {
      id: 'collection.metadata.package',
      title: `${collection.metadata.label} ${collection.locked ? '[LOCKED]' : ''}`,
      width: 560,
      height: 'auto',
      resizable: true,
      svelte: {
        class: CompendiumSheetComponent,
        props: {
          compendiumType: 'magicItem',
          document: null,
          filterStore: ItemCompendiumFilterStore
        }
      }
    }));

    this.compendiumCollection = compendiumCollection;
    this.options.svelte.props.document = collection;

    this.options.svelte.props.sheet = this;
  }

  /**
 * Default Application options
 *
 * @returns {object} options - Application options.
 * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
 */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['a5efc-compendium-sheet'],
      minimizable: true,
      svelte: {
        target: document.body
      }
    });
  }
}
