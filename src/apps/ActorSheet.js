import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import ActorSheetComponent from './sheets/ActorSheet.svelte';
import BackgroundDropDialog from './BackgroundDropDialog';

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

    this.actor = actor;
    this.options.svelte.props.sheet = this;
  }

  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['a5e-sheet', 'a5e-actor-sheet'],
      resizable: true,
      minimizable: true,
      width: 736,
      height: 672,

      svelte: {
        class: ActorSheetComponent,
        target: document.body
      }
    });
  }

  async _onDropBackground(item) {
    if (item?.type !== 'background') {
      ui.notifications.warn('The item provided to _onDropBackground must be of type "background".');
      return;
    }

    if (this.actor.type !== 'character') {
      ui.notifications.warn('Background documents cannot be added to NPCs.');
      return;
    }

    const dialog = new BackgroundDropDialog(item);
    dialog.render(true);

    let selectedAbilityScores;
    let selectedEquipment;

    try {
      ({ selectedAbilityScores, selectedEquipment } = await dialog.promise);
    } catch (error) {
      return;
    }

    const backgroundFeature = await fromUuid(item.system.feature);
    const startingEquipment = await Promise.all(selectedEquipment.map(
      (equipmentItem) => fromUuid(equipmentItem)
    ));

    await this.actor.createEmbeddedDocuments('Item', [
      item,
      backgroundFeature,
      ...startingEquipment
    ]);
  }
}
