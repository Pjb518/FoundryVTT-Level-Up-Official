// eslint-disable-next-line import/no-unresolved
import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import ActorDocument from './ActorDocument';

import ActorSheetComponent from './sheets/ActorSheet.svelte';
import BackgroundDropDialog from './dialogs/initializers/BackgroundDropDialog';
import CultureDropDialog from './dialogs/initializers/CultureDropDialog';

export default class ActorSheet extends SvelteApplication {
  /**
   * @inheritDoc
   */
  constructor(actor, options = {}) {
    super(foundry.utils.mergeObject(
      options,
      {
        id: `actor-sheet-${actor.isToken ? actor.parent?.id : actor.id}`,
        title: actor.name,
        svelte: {
          props: {
            actor: null
          }
        }
      }
    ));

    this.actor = actor.isToken ? actor.parent.actor : actor;

    this.options.svelte.props.actor = new ActorDocument(
      this.actor,
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
      width: 755,
      height: 708,

      svelte: {
        class: ActorSheetComponent,
        target: document.body
      }
    });
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    const PERMS = {
      isGM: game.user.isGM,
      isOwner: this.actor.isOwner,
      canConfigure: game.user.can('TOKEN_CONFIGURE'),
      isPack: this.actor.pack
    };

    if (!PERMS.isPack && (PERMS.isGM || (PERMS.isOwner && PERMS.canConfigure))) {
      buttons.unshift({
        label: this.actor.isToken ? 'Token' : 'Prototype Token',
        class: 'configure-token',
        icon: 'fas fa-user-circle',
        onclick: (event) => this._onConfigureToken(event)
      });
    }

    if (!PERMS.isPack) {
      buttons.unshift({
        label: 'Sheet Configuration',
        class: 'configure-sheet',
        icon: 'fas fa-cog fa-fw',
        title: 'Configure Sheet',
        onclick: (event) => this._onConfigureSheet(event)
      });
    }

    if (PERMS.isPack) {
      buttons.unshift({
        label: 'Import',
        class: 'import',
        icon: 'fas fa-download',
        onclick: (event) => this._onImport(event)
      });
    }

    return buttons;
  }

  _onImport(event) {
    if (event) event.preventDefault();
    return this.actor.collection
      .importFromCompendium(this.actor.compendium, this.actor.id);
  }

  _onConfigureToken(event) {
    if (event) event.preventDefault();

    const { token, prototypeToken } = this.actor;

    if (token) return token.sheet.render(true);

    // eslint-disable-next-line new-cap
    return new CONFIG.Token.prototypeSheetClass(prototypeToken).render(true);
  }

  _onConfigureSheet(event) {
    if (event) event.preventDefault();

    const sheetConfigDialog = new DocumentSheetConfig(this.actor, { top: this.position.top + 40 });
    sheetConfigDialog.render(true);
  }

  async _onDropDocument(document) {
    if (document.documentName === 'Actor') this.#onDropActor(document);
    else if (document.documentName === 'Item') this.#onDropItem(document);
  }

  // eslint-disable-next-line no-unused-vars, no-empty-function
  async #onDropActor(actor) { }

  async #onDropItem(item) {
    if (item.type === 'background') this.#onDropBackground(item);
    else if (item.type === 'culture') this.#onDropCulture(item);
    else if (item.type === 'destiny') this.#onDropDestiny(item);

    this.actor.createEmbeddedDocuments('Item', [item]);
  }

  async #onDropBackground(item) {
    if (this.actor.type !== 'character') {
      ui.notifications.warn('Background documents cannot be added to NPCs.');
      return;
    }

    let selectedAbilityScores = [];
    let selectedEquipment = [];
    let selectedSkills = [];
    let selectedLanguages = [];
    let selectedTools = [];

    const dialog = new BackgroundDropDialog(this.actor, item);
    dialog.render(true);

    try {
      ({
        selectedAbilityScores,
        selectedEquipment,
        selectedLanguages,
        selectedSkills,
        selectedTools
      } = await dialog.promise);
    } catch (error) {
      return;
    }

    const { feature } = item.system;
    const updates = {};

    // Setup Ability Scores
    selectedAbilityScores.forEach((abl) => {
      updates[`system.abilities.${abl}.value`] = this.actor.system.abilities[abl].value + 1;
    });

    // Setup Languages
    const updatedLanguages = [...new Set([
      ...this.actor.system.proficiencies.languages,
      ...selectedLanguages
    ])];
    updates['system.proficiencies.languages'] = updatedLanguages;

    // Setup Skills
    selectedSkills.forEach((skill) => {
      updates[`system.skills.${skill}.proficient`] = true;
    });

    // Setup Tools
    const updatedTools = [...new Set([
      ...this.actor.system.proficiencies.tools,
      ...selectedTools
    ])];
    updates['system.proficiencies.tools'] = updatedTools;

    // Update Actor
    await this.actor.update(updates);

    // Setup Background Feature and Equipment
    const backgroundFeature = await fromUuid(feature);
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

    let selectedLanguages = [];

    const dialog = new CultureDropDialog(this.actor, item);
    dialog.render(true);

    try {
      ({ selectedLanguages } = await dialog.promise);
    } catch (error) {
      return;
    }

    const { features } = item.system;
    const updates = {};

    const updatedLanguages = [...new Set([
      ...this.actor.system.proficiencies.languages,
      ...selectedLanguages
    ])];
    updates['system.proficiencies.languages'] = updatedLanguages;

    // Update Actor
    this.actor.update(updates);

    // Setup features
    const cultureFeatures = await Promise.all(
      Object.values(features)
        .map((f) => fromUuid(f.uuid))
    );

    if (cultureFeatures.length) {
      this.actor.createEmbeddedDocuments('Item', [
        item,
        ...cultureFeatures
      ].filter(Boolean));
    }
  }

  async #onDropDestiny(item) {
    if (this.actor.type !== 'character') {
      ui.notifications.warn('Destiny documents cannot be added to NPCs.');
      return;
    }

    const uuids = [
      item.system.sourceOfInspiration,
      item.system.inspirationFeature,
      item.system.fulfillmentFeature
    ];
    const features = (await Promise.all(uuids.map((uuid) => fromUuid(uuid)))).filter((f) => f);

    this.actor.createEmbeddedDocuments('Item', [
      item,
      ...features
    ]);
  }
}
