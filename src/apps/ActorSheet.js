import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

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
      width: 730,
      height: 672,

      svelte: {
        class: ActorSheetComponent,
        target: document.body
      }
    });
  }

  async _onDropDocument(document) {
    if (document.documentName === 'Actor') this.#onDropActor(document);
    else if (document.documentName === 'Item') this.#onDropItem(document);
  }

  async #onDropActor(actor) { }

  async #onDropItem(item) {
    if (item.type === 'background') this.#onDropBackground(item);
    else if (item.type === 'culture') this.#onDropCulture(item);

    this.actor.createEmbeddedDocuments('Item', [item]);
  }

  async #onDropBackground(item) {
    if (this.actor.type !== 'character') {
      ui.notifications.warn('Background documents cannot be added to NPCs.');
      return;
    }

    const { equipment, feature, includesASI } = item.system;
    const backgroundFeature = await fromUuid(feature);

    let selectedAbilityScores = [];
    let selectedEquipment = [];

    // Do not show the dialog if there is no ASI or equipment to select.
    if (includesASI || equipment.length) {
      const dialog = new BackgroundDropDialog(item);
      dialog.render(true);

      try {
        ({ selectedAbilityScores, selectedEquipment } = await dialog.promise);
      } catch (error) {
        return;
      }
    }

    const startingEquipment = await Promise.all(selectedEquipment.map(
      (equipmentItem) => fromUuid(equipmentItem)
    ));

    // Do not attempt to add items if there are no background features or starting
    // equipment to add.
    if (backgroundFeature || startingEquipment.length) {
      await this.actor.createEmbeddedDocuments('Item', [
        item,
        backgroundFeature,
        ...startingEquipment
      ].filter(Boolean));
    }
  }

  async #onDropCulture(item) {
    if (this.actor.type !== 'character') {
      ui.notifications.warn('Culture documents cannot be added to NPCs.');
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
