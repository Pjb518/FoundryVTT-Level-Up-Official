/* eslint-disable no-unused-vars */
import createTemplateDocument from '../utils/measuredTemplates/createTemplateDocument';
import getDeterministicBonus from '../dice/getDeterministicBonus';
import validateTemplateData from '../utils/measuredTemplates/validateTemplateData';

import ActionActivationDialog from '../apps/dialogs/initializers/ActionActivationDialog';
import ActionSelectionDialog from '../apps/dialogs/initializers/ActionSelectionDialog';
import ItemMeasuredTemplate from '../pixi/ItemMeasuredTemplate';

import ActionsManager from '../managers/ActionsManager';
import ResourceConsumptionManager from '../managers/ResourceConsumptionManager';
import RollPreparationManager from '../managers/RollPreparationManager';

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
export default class ItemA5e extends Item {
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

  async showActionActivationDialog(actionId, action) {
    if (
      !foundry.utils.isEmpty(action?.rolls)
      || !foundry.utils.isEmpty(action?.prompts)
      || validateTemplateData(this, actionId)
    ) { return true; }

    // Check if consumers need a dialog
    const consumerTypes = new Set(
      Object.values(action?.consumers ?? {}).map((c) => c.type)
    );

    if (consumerTypes.intersects(CONFIG.A5E.configurableConsumers)) {
      return true;
    }

    return false;
  }

  async #activateAction(actionId, options) {
    const dialog = new ActionActivationDialog({
      actionId,
      options,
      actorDocument: this.actor,
      itemDocument: this
    });

    const action = this.actions[actionId];
    let promise = {};

    // Skip dialog if nothing configured.
    if (await this.showActionActivationDialog(actionId, action)) {
      dialog.render(true);
      promise = await dialog.promise;
      if (!promise) return null;
    }

    promise.rolls ??= [];
    promise.rolls.push(promise?.attack ?? {});

    const rollPreparationManager = new RollPreparationManager(
      this.actor,
      this,
      promise.consumers ?? {},
      promise.rolls ?? {}
    );

    const rolls = await rollPreparationManager.prepareRolls();

    let validTemplate = false;
    if (promise.placeTemplate) {
      validTemplate = validateTemplateData(this, actionId);
      if (validTemplate) { await this.#placeActionTemplate(actionId); }
    }

    const resourceConsumptionManager = new ResourceConsumptionManager(
      this.actor,
      this,
      actionId,
      promise.consumers ?? {}
    );

    await resourceConsumptionManager.consumeResources();

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: rolls.length ? CONST.CHAT_MESSAGE_TYPES.ROLL : CONST.CHAT_MESSAGE_TYPES.OTHER,
      sound: CONFIG.sounds.dice,
      rolls: rolls.map(({ roll }) => roll),
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          itemId: this.uuid,
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
    const quantity = this.actions[actionId].area.quantity ?? 1;

    try {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < quantity; i++) {
        const templateDocument = createTemplateDocument(this, actionId);
        const template = new ItemMeasuredTemplate(templateDocument);
        if (!template) return;

        template.item = this;
        template.actorSheet = this.actor?.sheet || null;

        let placed = false;
        setTimeout(() => {
          if (placed) return;

          template?._onCancel();
          throw new Error('Time limit for placing template exceeded');
        }, 30000);

        // eslint-disable-next-line no-await-in-loop
        const templateData = await template?.drawPreview();
        placed = true;

        if (templateData) { Hooks.callAll('a5e.templateCreated', this, templateData, game.user.id); }
      }
    } catch (err) { // Empty Block
    }
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

  // TODO: Reevaluate the approach here. It's completely separate from our other consumers.
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

  async recharge(actionId, state = false) {
    if (state || !this.actor) return;
    let max = getDeterministicBonus(this.system.uses.max, this.actor.getRollData());
    let formula = this.system.uses.recharge.formula ?? '1d6';
    let threshold = this.system.uses.recharge.threshold ?? 6;
    let updatePath = 'system.uses.value';

    if (actionId) {
      const action = this.actions[actionId];

      max = getDeterministicBonus(action.uses?.max ?? '', this.actor.getRollData());
      formula = action.uses?.recharge?.formula ?? '1d6';
      threshold = action.uses?.recharge?.threshold ?? 6;
      updatePath = `system.actions.${actionId}.uses.value`;
    }

    // Roll
    const roll = await new Roll(formula, this.actor.getRollData()).evaluate({ async: true });
    // TODO: Make the message prettier
    roll.toMessage();

    if (roll.total >= threshold) { await this.update({ [updatePath]: max }); }
  }
}
