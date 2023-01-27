import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import ActorDocument from './ActorDocument';

import ActorSheetComponent from './sheets/ActorSheet.svelte';
import BackgroundDropDialog from './BackgroundDropDialog';
import LanguageSelectDialog from './dialogs/initializers/LanguageSelectDialog';

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
            actor: null
          }
        }
      }
    ));

    this.actor = actor;
    this.options.svelte.props.actor = new ActorDocument(
      actor,
      { delete: this.close.bind(this) }
    );
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
      width: 730,
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

  async _onDropCulture(item) {
    if (item?.type !== 'culture') throw Error('_onDropCulture() must be called with a culture type item.');

    if (this.actor.type !== 'character') {
      ui.notifications.warn('Background documents cannot be added to NPCs.');
      return;
    }

    // Concat known languages with newly learned, removing duplicates.
    let known = this.actor.system.proficiencies.languages;
    known = known.concat(item.system.languages.base);

    const addLangugaes = item.system.languages.additional;
    if (addLangugaes > 0) {
      const dialog = new LanguageSelectDialog({
        languages: known,
        disabled: known,
        /* TODO: Add selectionCount to the LanguageSelect Dialog.
        This can be done after languages get delocalized. */
        selectionCount: addLangugaes
      });
      dialog.render(true);
      known = await dialog.promise;
    }

    this.actor.update({
      'system.proficiencies.languages': [...new Set(known)] // Keep only unique values
    });

    const features = await Promise.all(
      Object.values(item.system.features)
        .map((f) => fromUuid(f.uuid))
    );

    this.actor.createEmbeddedDocuments('Item', [
      item,
      ...features
    ]);
  }
}
