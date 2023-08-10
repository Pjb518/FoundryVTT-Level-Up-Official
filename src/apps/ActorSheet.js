import { SvelteApplication } from '#runtime/svelte/application';

import ActorDocument from './ActorDocument';

import ActorSheetComponent from './sheets/ActorSheet.svelte';
import LimitedSheetComponent from './sheets/LimitedSheet.svelte';

import BackgroundCultureDropDialog from './dialogs/initializers/BackgroundCultureDropDialog';
import HeritageDropDialog from './dialogs/initializers/HeritageDropDialog';

export default class ActorSheet extends SvelteApplication {
  /**
   * @inheritDoc
   */
  constructor(actor, options = {}) {
    options.svelte ??= {};

    if ([
      CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
      CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
    ].includes(actor.permission)) {
      options.classes = ['a5e-sheet', 'a5e-actor-sheet', 'a5e-actor-sheet--limited'];
      options.svelte.class = LimitedSheetComponent;
      options.width = 512;
      options.resizable = false;
    } else {
      options.svelte.class = ActorSheetComponent;
      options.width = 755;
      options.height = 706;
      options.resizable = true;
    }

    super(foundry.utils.mergeObject(
      options,
      {
        baseApplication: 'ActorSheet',
        id: `actor-sheet-${actor.isToken ? actor.parent?.id : actor.id}`,
        title: actor.name,
        token: null,
        svelte: {
          props: {
            document: null
          }
        }
      }
    ));

    this.actor = actor.isToken ? actor.parent.actor : actor;

    this.options.svelte.props.document = new ActorDocument(
      this.actor,
      { delete: this.close.bind(this) }
    );

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
      baseApplication: 'ActorSheet',
      classes: ['a5e-sheet', 'a5e-actor-sheet'],
      minimizable: true,
      svelte: {
        target: document.body
      },
      token: null
    });
  }

  get token() {
    return this.options?.token || this.actor.token || null;
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
        label: this.options.token ? 'Token' : 'Prototype Token',
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

  async #getCultureFeatures(item, featureList) {
    const cultureFeatures = await Promise.all(
      featureList.map(async (feature) => fromUuid(item.features[feature]?.uuid))
    );

    return cultureFeatures.filter(Boolean);
  }

  #getProficiencies(property, selectedOptions) {
    return [...new Set([
      ...this.actor.system.proficiencies[property],
      ...selectedOptions
    ])];
  }

  async #getStartingEquipment(item, selectedEquipmentIds) {
    const selectedEquipment = await Promise.all(selectedEquipmentIds.map(
      async (id) => fromUuid(item.equipment[id]?.uuid)
    ));

    return selectedEquipment.reduce((startingEquipment, curr) => {
      if (curr) {
        const equipmentItem = curr.toObject();
        equipmentItem.system.quantity = item.equipment[curr]?.quantity;
        startingEquipment.push(equipmentItem);
      }

      return startingEquipment;
    }, []);
  }

  _onImport(event) {
    if (event) event.preventDefault();
    return this.actor.collection
      .importFromCompendium(this.actor.compendium, this.actor.id);
  }

  _onConfigureToken(event) {
    if (event) event.preventDefault();
    if (this.token) return this.token.sheet.render(true);
    // eslint-disable-next-line new-cap
    return new CONFIG.Token.prototypeSheetClass(this.actor.prototypeToken).render(true);
  }

  _onConfigureSheet(event) {
    if (event) event.preventDefault();

    const sheetConfigDialog = new DocumentSheetConfig(this.actor, { top: this.position.top + 40 });
    sheetConfigDialog.render(true);
  }

  async _onDrop(event, options = {}) {
    const transferData = event.dataTransfer.getData('text/plain');
    if (!transferData) return;

    const dragData = JSON.parse(transferData);

    if (this.actor?.flags?.a5e?.currentTab !== 'inventory') {
      if (dragData?.actorId === this.actor?.id) return;
      if (dragData?.parentId === this.actor?.id) return;
    }

    const { uuid } = dragData;
    const document = await fromUuid(uuid);

    this._onDropDocument(document, options);
  }

  async _onDropDocument(document, options = {}) {
    if (document.documentName === 'Actor') this.#onDropActor(document);
    else if (document.documentName === 'Item') this.#onDropItem(document, options);
    else if (document.documentName === 'ActiveEffect') this.#onDropActiveEffect(document);
  }

  // eslint-disable-next-line no-unused-vars, no-empty-function, @typescript-eslint/no-unused-vars
  async #onDropActor(actor) {
    //
  }

  async #onDropActiveEffect(effect) {
    this.actor.createEmbeddedDocuments('ActiveEffect', [effect]);
  }

  async #onDropItem(item, options = {}) {
    if (item.type === 'background') this.#onDropBackground(item);
    else if (item.type === 'culture') this.#onDropCulture(item);
    else if (item.type === 'destiny') this.#onDropDestiny(item);
    else if (item.type === 'heritage') this.#onDropHeritage(item);
    else if (item.type === 'object') this.#onDropObject(item, options);
    else if (item.type === 'spell') this.#onDropSpell(item);
    else this.actor.createEmbeddedDocuments('Item', [item]);
  }

  async #onDropBackground(item) {
    if (this.actor.type !== 'character') {
      ui.notifications.warn('Background documents cannot be added to NPCs.');
      return;
    }

    let selectedAbilityScores = [];
    let selectedArmor = [];
    let selectedEquipment = [];
    let selectedSkills = [];
    let selectedLanguages = [];
    let selectedTools = [];
    let selectedWeapons = [];

    const dialog = new BackgroundCultureDropDialog(this.actor, item);
    dialog.render(true);

    try {
      ({
        selectedAbilityScores,
        selectedArmor,
        selectedEquipment,
        selectedLanguages,
        selectedSkills,
        selectedTools,
        selectedWeapons
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

    // Setup Skills
    selectedSkills.forEach((skill) => {
      updates[`system.skills.${skill}.proficient`] = true;
    });

    // Update Actor
    await this.actor.update({
      ...updates,
      'system.proficiencies.armor': this.#getProficiencies('armor', selectedArmor),
      'system.proficiencies.languages': this.#getProficiencies('languages', selectedLanguages),
      'system.proficiencies.tools': this.#getProficiencies('tools', selectedTools),
      'system.proficiencies.weapons': this.#getProficiencies('weapons', selectedWeapons)
    });

    // Setup Background Feature and Equipment
    const backgroundFeature = await fromUuid(feature);
    const startingEquipment = await this.#getStartingEquipment(item, selectedEquipment);

    // Do not attempt to add items if there are no background features or starting
    // equipment to add.
    if (backgroundFeature || startingEquipment.length) {
      await this.actor.createEmbeddedDocuments('Item', [
        item,
        backgroundFeature,
        ...startingEquipment
      ].filter(Boolean));

      // Apply permanent effects
      this.actor.applyPermanentEffects();
    }
  }

  async #onDropCulture(item) {
    if (this.actor.type !== 'character') {
      ui.notifications.warn('Culture documents cannot be added to NPCs.');
      return;
    }

    let selectedArmor = [];
    let selectedEquipment = [];
    let selectedSkills = [];
    let selectedLanguages = [];
    let selectedTools = [];
    let selectedWeapons = [];

    const dialog = new BackgroundCultureDropDialog(this.actor, item);
    dialog.render(true);

    try {
      ({
        selectedArmor,
        selectedEquipment,
        selectedLanguages,
        selectedSkills,
        selectedTools,
        selectedWeapons
      } = await dialog.promise);
    } catch (error) {
      return;
    }

    const features = Object.keys(item.system.features);
    const updates = {};

    // Setup Skills
    selectedSkills.forEach((skill) => {
      updates[`system.skills.${skill}.proficient`] = true;
    });

    // Update Actor
    await this.actor.update({
      ...updates,
      'system.proficiencies.armor': this.#getProficiencies('armor', selectedArmor),
      'system.proficiencies.languages': this.#getProficiencies('languages', selectedLanguages),
      'system.proficiencies.tools': this.#getProficiencies('tools', selectedTools),
      'system.proficiencies.weapons': this.#getProficiencies('weapons', selectedWeapons)
    });

    // Setup Culture Feature and Equipment
    const cultureFeatures = await this.#getCultureFeatures(item, features);
    const startingEquipment = await this.#getStartingEquipment(item, selectedEquipment);

    // Do not attempt to add items if there are no background features or starting
    // equipment to add.
    if (cultureFeatures.length || startingEquipment.length) {
      await this.actor.createEmbeddedDocuments('Item', [
        item,
        ...cultureFeatures,
        ...startingEquipment
      ].filter(Boolean));

      // Apply permanent effects
      this.actor.applyPermanentEffects();
    }
  }

  async #onDropDestiny(item) {
    if (this.actor.type !== 'character') {
      ui.notifications.warn('Destiny documents cannot be added to NPCs.');
      return;
    }

    await this.actor.setFlag('a5e', 'destinyFulfilled', false);

    const uuids = [
      item.system.sourceOfInspiration,
      item.system.inspirationFeature
    ];
    const features = (await Promise.all(uuids.map((uuid) => fromUuid(uuid)))).filter((f) => f);

    await this.actor.createEmbeddedDocuments('Item', [
      item,
      ...features
    ]);

    // Apply permanent effects
    this.actor.applyPermanentEffects();
  }

  async #onDropHeritage(item) {
    if (this.actor.type !== 'character') {
      ui.notifications.warn('Heritage documents cannot be added to NPCs.');
      return;
    }

    let selectedFeatures = [];
    let gifts = [];

    const dialog = new HeritageDropDialog(this.actor, item);
    dialog.render(true);

    try {
      ({
        selectedFeatures,
        gifts
      } = await dialog.promise);
    } catch (error) {
      return;
    }

    const itemDocuments = await Promise.all(
      [...selectedFeatures, ...gifts].map(async (uuid) => (await fromUuid(uuid)).toObject())
    );

    await this.actor.createEmbeddedDocuments('Item', [
      item,
      ...itemDocuments
    ]);

    // Apply permanent effects
    this.actor.applyPermanentEffects();
  }

  async #onDropObject(item, options) {
    // Check if item is dropped is on the sheet already
    if (item?.parent?.id === this.actor.id) {
      item.updateContainer(options.containerUuid ?? '');
      return;
    }

    const i = item.toObject();
    i.system.containerId = options.containerUuid ?? '';
    (await this.actor.createEmbeddedDocuments('Item', [i]))
      ?.[0]
      ?.updateContainer(options.containerUuid ?? '');
  }

  #onDropSpell(item) {
    const spellLevel = item.system.level;

    const {
      attackBonus, cost, craftingComponent, saveDC, rarity
    } = CONFIG.A5E.scrollData[spellLevel];

    const scroll = {
      name: `Spell Scroll (${item.name})`,
      img: 'icons/sundries/scrolls/scroll-writing-brown-gold.webp',
      type: 'object',
      system: {
        actions: {},
        craftingComponents: craftingComponent,
        description: item.system.description,
        price: cost,
        objectType: 'consumable',
        rarity
      }
    };

    scroll.system.actions = item.actions.values().reduce((actions, _action) => {
      const action = { ..._action };

      action.prompts = Object.entries(action?.prompts ?? {}).reduce((prompts, [key, _prompt]) => {
        const prompt = { ..._prompt };

        if (prompt.type === 'savingThrow') {
          prompt.saveDC.type = 'custom';
          prompt.saveDC.bonus = saveDC;
        }

        prompts[key] = prompt;

        return prompts;
      }, {});

      action.rolls = Object.entries(action?.rolls ?? {}).reduce((rolls, [key, _roll]) => {
        const roll = { ..._roll };

        if (roll.type === 'attack') {
          roll.ability = 'none';
          roll.bonus = attackBonus.toString(10);
        }

        rolls[key] = roll;

        return rolls;
      }, {});
      actions[foundry.utils.randomID()] = action;
      return actions;
    }, {});

    this.actor.createEmbeddedDocuments('Item', [scroll]);
  }

  /** @inheritdoc */
  async close(options) {
    this.options.token = null;
    return super.close(options);
  }
}
