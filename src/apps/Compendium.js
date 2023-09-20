import { SvelteApplication } from '#runtime/svelte/application';

import SpellCompendia from './compendia/SpellCompendia.svelte';

export default class SpecialCompendium extends SvelteApplication {
  constructor(compendiumCollection, options = {}) {
    const { collection } = compendiumCollection;

    super(foundry.utils.mergeObject(options, {
      id: collection.metadata.package,
      title: collection.metadata.label,
      width: 755,
      height: 706,
      resizable: true,
      svelte: {
        class: SpellCompendia,
        props: {
          document: null
        }
      }
    }));

    this.compendiumCollection = compendiumCollection.collection;
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
      // baseApplication: 'ActorSheet',
      // classes: ['a5e-sheet', 'a5e-actor-sheet'],
      minimizable: true,
      svelte: {
        target: document.body
      }
    });
  }
}
