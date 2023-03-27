import createTemplateDocument from '../utils/measuredTemplates/createTemplateDocument';
import getChatCardTargets from '../utils/getChatCardTargets';
import validateTemplateData from '../utils/measuredTemplates/validateTemplateData';

import ActionActivationDialog from '../apps/dialogs/initializers/ActionActivationDialog';
import ActionSelectionDialog from '../apps/dialogs/initializers/ActionSelectionDialog';
import ItemMeasuredTemplate from '../pixi/ItemMeasuredTemplate';

import ActionsManager from '../managers/ActionsManager';
import RollPreparationManager from '../managers/RollPreparationManager';

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
export default class ItemA5e extends Item {
  static chatListeners(html) {
    html.find('.a5e-js-chat-ability-check-button').click(this._onClickChatAbilityCheckButton.bind(this));
    html.find('.a5e-js-chat-saving-throw-button').click(this._onClickChatSavingThrowButton.bind(this));
    html.find('.a5e-js-toggle-roll-tooltip-visibility').click(this._onToggleRollTooltipVisibility.bind(this));
  }

  get abilityMod() {
    const itemData = this.system;

    if (!itemData.ability) return null;

    if (itemData.ability === 'spellcasting') {
      return this.actor ? this.actor.system.attributes.spellcasting : 'int';
    }

    if (itemData.ability === 'default') {
      if (this.type === 'object' && itemData.objectType === 'weapon') {
        if (itemData.actionOptions.includes('attack') && itemData.attack.type === 'rangedWeaponAttack') {
          return 'dex';
        }

        if (this.actor && itemData.weaponProperties.includes('finesse')) {
          const { str, dex } = this.actor.system.abilities;

          return dex.value > str.value ? 'dex' : 'str';
        }
      }

      if (this.type === 'spell') {
        return this.actor ? this.actor.system.attributes.spellcasting : 'int';
      }

      return 'str';
    }

    return itemData.ability || 'str';
  }

  get actions() {
    return new ActionsManager(this);
  }

  // *****************************************************************************************

  /**
   * A handler for activating an item. An actionId can be passed to this method to use a specific
   * action defined on the item. If there are no actions defined, this method defaults to
   * outputting the item's description.
   *
  //  * This method accepts an options object to further customize the activation process.
   *
   * @param {string} actionId
   * @param {object options
   * @returns
   */
  async activate(actionId, options = {}) {
    // Do not allow an item to activate if it not attached to an actor or if the user does
    // not have owner permissions for the actor.
    if (!this.actor || !this?.actor.isOwner) return;

    if (this.actions.count === 0) {
      // If no actions are defined, default to outputting just the item description.
      this.shareItemDescription();
    } else if (this.actions.count === 1) {
      // If there is a single defined action, use that action.
      this.#activateAction(this.actions.keys()[0], options);
    } else if (actionId) {
      // If an action is provided, use the provided action
      this.#activateAction(actionId, options);
    } else {
      // If no action id was provided, and there is more then one action defined for the item,
      // show a dialog window so that the user can select an appropriate action.
      const dialog = new ActionSelectionDialog(this);
      await dialog.render(true);

      const promise = await dialog.promise;

      // If no selection is made, cancel the activation.
      if (!promise?.actionId) return;

      this.#activateAction(promise.actionId, options);
    }
  }

  async #activateAction(actionId, options) {
    const dialog = new ActionActivationDialog({
      actionId,
      options,
      actorDocument: this.actor,
      itemDocument: this
    });

    const action = this.actions[actionId];

    if (
      foundry.utils.isEmpty(action?.rolls)
      && foundry.utils.isEmpty(action?.prompts)
      && !validateTemplateData(this, actionId)
    ) {
      if (!foundry.utils.isEmpty(action?.consumers)) { this.#consume(actionId); }
      return this.shareItemDescription(action);
    }

    dialog.render(true);

    const promise = await dialog.promise;

    if (!promise) return null;

    promise.rolls ??= [];
    promise.rolls.push(promise?.attack ?? {});

    const rollPreparationManager = new RollPreparationManager(this.actor, promise.rolls);
    const rolls = await rollPreparationManager.prepareRolls();

    let validTemplate = false;
    if (promise.placeTemplate) {
      validTemplate = validateTemplateData(this, actionId);
      if (validTemplate) { this.#placeActionTemplate(actionId); }
    }

    this.#consume(actionId, promise.consumers);

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: rolls.length ? CONST.CHAT_MESSAGE_TYPES.ROLL : CONST.CHAT_MESSAGE_TYPES.OTHER,
      sound: CONFIG.sounds.dice,
      rolls: rolls.map(({ roll }) => roll),
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          cardType: 'item',
          img: action.img ?? this.img ?? 'icons/svg/item-bag.svg',
          name: this.name,
          actionName: action.name,
          actionDescription: action?.descriptionOutputs?.includes('action')
            ? TextEditor.enrichHTML(action.description, {
              async: false
            })
            : null,
          itemDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? TextEditor.enrichHTML(this.system.description, {
              async: false
            })
            : null,
          prompts: promise.prompts,
          rollData: rolls.map(({ roll, ...rollData }) => rollData)
        }
      },
      content: '<article></article>'
    };

    const chatCard = await ChatMessage.create(chatData);

    Hooks.callAll('a5e.itemActivate', this, {
      actionId, action, dialog: promise, options, rolls, validTemplate
    });

    return chatCard;
  }

  async #placeActionTemplate(actionId) {
    const templateDocument = createTemplateDocument(this, actionId);
    const template = new ItemMeasuredTemplate(templateDocument);

    template.item = this;
    template.actorSheet = this.actor?.sheet || null;

    Hooks.call('a5e.preItemTemplateCreate', templateDocument, template);

    if (template) template.drawPreview();
  }

  async shareItemDescription(action) {
    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          cardType: 'item',
          actionDescription: action?.descriptionOutputs?.includes('action')
            ? TextEditor.enrichHTML(action.description, {
              async: false
            })
            : null,
          itemDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? TextEditor.enrichHTML(this.system.description, {
              async: false
            })
            : null,
          img: this.img,
          name: this.name
        }
      },
      content: '<article></article>'
    };

    const chatCard = ChatMessage.create(chatData);

    await this.#consumeSelf();

    Hooks.callAll('a5e.itemActivate', this, { action });
    return chatCard;
  }

  async #consume(actionId, promiseData) {
    // Consume self if consumable
    this.#consumeSelf();

    // Get other consumers
    const consumers = Object.entries(this.actions[actionId]?.consumers ?? {});
    consumers.forEach(([consumerId, consumer]) => {
      switch (consumer?.type) {
        case 'actionUses':
          return this.#consumeActionUses(actionId, consumerId, consumer, promiseData.actionUses);
        case 'ammunition':
          return this.#consumeAmmunition(consumer);
        case 'itemUses':
          return this.#consumeItemUses(promiseData.itemUses);
        case 'quantity':
          return this.#consumeQuantity(consumer);
        case 'resource':
          return this.#consumeResource(consumer);
        case 'spell':
          return this.#consumeSpellResource(promiseData.spell);
        default: return null;
      }
    });
  }

  async #consumeActionUses(actionId, consumerId, consumer, promiseData) {
    const { quantity } = promiseData;

    if (!quantity || !this.actor) return;
    const newValue = Math.max(consumer.value - quantity, 0);
    if (!newValue) return;

    await this.update({
      [`system.actions.${actionId}.consumers.${consumerId}.value`]: newValue
    });
  }

  async #consumeAmmunition(consumer) {
    return this.#consumeQuantity(consumer);
  }

  async #consumeItemUses(promiseData) {
    const { value } = this.system.uses;
    const { quantity } = promiseData;
    if (!value || !quantity) return;

    await this.update({
      'system.uses.value': Math.max(value - quantity, 0)
    });
  }

  async #consumeQuantity(consumer) {
    const { itemId, quantity } = consumer;
    if (!this.actor || itemId === '') return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const newQuantity = Math.max(item.system.quantity - quantity, 0);
    await this.actor.updateEmbeddedDocuments(
      'Item',
      [{ _id: item.id, 'system.quantity': newQuantity }]
    );
  }

  async #consumeResource(consumer) {
    const { resource, quantity, restore } = consumer;
    if (!this.actor || !resource) return;

    const config = CONFIG.A5E.resourceConsumerConfig?.[resource];
    if (!config) return;

    const { path, type } = config;
    const value = foundry.utils.getProperty(this.actor.system, path);
    if (!value && !restore) return;

    let updateObject;

    if (type === 'boolean') {
      updateObject = { [`system.${path}`]: (restore ?? false) };
    } else {
      updateObject = { [`system.${path}`]: Math.max(value - quantity, 0) };
    }

    await this.actor.update(updateObject);
  }

  async #consumeSpellResource(promiseData) {
    if (!promiseData || !this.actor) return;

    const {
      consume,
      level,
      points
    } = promiseData;

    let updateObject = {};

    if (consume === 'spellSlot') {
      const value = this.actor.system.spellResources.slots?.[level]?.current;
      updateObject = { [`system.spellResources.slots.${level}.current`]: Math.max(value - 1, 0) };
    } else if (consume === 'spellPoint') {
      const value = this.actor.system.spellResources.points.current;
      updateObject = { 'system.spellResources.points.current': Math.max(value - points, 0) };
    } else {
      return;
    }

    this.actor.update(updateObject);
  }

  async #consumeSelf() {
    if (this.system?.objectType === 'consumable') {
      this.update({ 'system.quantity': Math.max(this.system.quantity - 1, 0) });
    }
  }

  async configureItem() {
    await this.sheet.render(true);
  }

  async duplicateItem() {
    const owningActor = this.actor;
    const newItem = foundry.utils.duplicate(this);
    newItem.name = `${newItem.name} (Copy)`;

    if (owningActor) owningActor.createEmbeddedDocuments('Item', [newItem]);
    else Item.createDocuments([newItem]);
  }

  async toggleAttunement() {
    if (!this.type === 'object') return;

    await this.update({
      'system.attuned': !this.system.attuned
    });
  }

  async toggleBroken() {
    if (!this.type === 'object') return;

    await this.update({
      'system.broken': !this.system.broken
    });
  }

  async toggleEquipped() {
    if (!this.type === 'object' || !this.actor) return;

    await this.update({
      'system.equipped': !this.system.equipped
    });
  }

  async toggleFavorite() {
    if (!this.actor) return;

    await this.update({
      'system.favorite': !this.system.favorite
    });
  }

  async togglePrepared() {
    if (!this.type === 'spell' || !this.actor) return;

    await this.update({
      'system.prepared': !this.system.prepared
    });
  }

  async toggleUnidentified() {
    if (!this.type === 'object') return;

    await this.update({
      'system.unidentified': !this.system.unidentified
    });
  }

  static async _onClickChatAbilityCheckButton(event) {
    /* eslint-disable no-await-in-loop, no-restricted-syntax */
    event.preventDefault();

    const { ability } = event.currentTarget.dataset;
    const targets = getChatCardTargets();

    for (const token of targets) {
      await token.actor.rollAbilityCheck(ability);
    }
  }

  static async _onClickChatSavingThrowButton(event) {
    event.preventDefault();

    const { ability } = event.currentTarget.dataset;
    const targets = getChatCardTargets();

    for (const token of targets) {
      await token.actor.rollSavingThrow(ability);
    }
  }

  static _onToggleRollTooltipVisibility(event) {
    event.preventDefault();

    const tooltip = Array.from($(event.currentTarget).siblings('.a5e-dice-tooltip'))[0];
    $(tooltip).slideToggle();
  }
}
