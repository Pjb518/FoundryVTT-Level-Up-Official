import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import ActionsManager from '../managers/ActionsManager';

import constructRollFormula from '../dice/constructRollFormula';
import constructD20RollFormula from '../dice/constructD20RollFormula';
import createTemplateDocument from '../utils/measuredTemplates/createTemplateDocument';
import getChatCardTargets from '../utils/getChatCardTargets';
import getDeterministicBonus from '../dice/getDeterministicBonus';
import validateTemplateData from '../utils/measuredTemplates/validateTemplateData';

import ActionActivationDialog from '../apps/dialogs/initializers/ActionActivationDialog';
import ActionSelectionDialog from '../apps/dialogs/initializers/ActionSelectionDialog';
import ItemMeasuredTemplate from '../pixi/ItemMeasuredTemplate';

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

  get hasValidTemplateDefinition() {
    const { area } = this.system;

    if (!area.shape) return false;

    if (area.shape === 'line' || area.shape === 'cone') return !!area.length;
    if (area.shape === 'sphere' || area.shape === 'cylinder') return !!area.radius;
    if (area.shape === 'cube') return !!area.width;

    return false;
  }

  get actions() {
    return new ActionsManager(this);
  }

  // *****************************************************************************************

  /**
   * A handler for acivating an item. An actionId can be passed to this method to use a specific
   * action defined on the item. If there are no actions defined, this method defaults to
   * outputting the item's description.
   *
   * This method accepts an options object to further customise the activation process.
   *
   * @param {string} actionId
   * @param {object options
   * @returns
   */
  async activate(actionId, options = {}) {
    // Do not allow an item to activate if it not attached to an actor.
    if (!this.actor) return;

    if (this.actions.count === 0) {
      // If no actions are defined, default to outputting just the item description.
      this.shareItemDescription();
    } else if (this.actions.count === 1) {
      // If there is a single defined action, use that action.
      this.#activateAction(this.actions.keys()[0]);
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

      this.#activateAction(promise.actionId);
    }
  }

  async #activateAction(actionId, options) {
    const dialog = new ActionActivationDialog({
      actionId,
      options,
      actorDocument: this.actor,
      itemDocument: this
    });

    dialog.render(true);

    const promise = await dialog.promise;

    if (!promise) return;

    promise.rolls ??= [];
    promise.rolls.push(promise?.attack ?? {});

    const rolls = await Promise.resolve(promise?.rolls?.reduce(async (accP, roll) => {
      const acc = await accP;
      const rollData = this.#prepareItemRoll(roll);

      if (rollData?.rollFormula) {
        let evaluatedRoll;

        if (['abilityCheck', 'attack', 'savingThrow', 'skillCheck', 'toolCheck'].includes(roll.type)) {
          evaluatedRoll = await new CONFIG.Dice.D20Roll(rollData.rollFormula).roll({ async: true });
        } else {
          evaluatedRoll = await new Roll(rollData.rollFormula).roll({ async: true });
        }

        acc.push({
          rollData: { roll, ...rollData },
          roll: evaluatedRoll
        });
      }

      return acc;
    }, []));

    if (promise.placeTemplate) {
      const validTemplate = validateTemplateData(this, actionId);

      if (validTemplate) { this.#placeActionTemplate(actionId); }
    }

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      sound: CONFIG.sounds.dice,
      rolls: rolls.map(({ roll }) => roll),
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          cardType: 'item',
          img: this.actions[actionId].img ?? 'icons/svg/item-bag.svg',
          name: this.actions[actionId].name,
          prompts: promise.prompts,
          rollData: rolls.flatMap(({ roll, ...rollData }) => Object.values(rollData))
        }
      },
      content: '<article></article>'
    };

    ChatMessage.create(chatData);
  }

  async #placeActionTemplate(actionId) {
    const templateDocument = createTemplateDocument(this, actionId);
    const template = new ItemMeasuredTemplate(templateDocument);

    template.item = this;
    template.actorSheet = this.actor?.sheet || null;

    Hooks.call('a5e.preItemTemplateCreate', templateDocument, template);

    if (template) template.drawPreview();
  }

  #prepareItemRoll(roll) {
    switch (roll?.type) {
      case 'abilityCheck':
        return this.actor.getDefaultAbilityCheckData(roll.ability);
      case 'attack':
        return this.#prepareAttackRoll(roll);
      case 'damage':
        return this.#prepareDamageRoll(roll);
      case 'generic':
        return this.#prepareGenericRoll(roll);
      case 'healing':
        return this.#prepareHealingRoll(roll);
      case 'savingThrow':
        return this.actor.getDefaultSavingThrowData(roll.ability);
      case 'skillCheck':
        return this.actor.getDefaultSkillCheckData(roll.skill, roll.ability);
      case 'toolCheck':
        return this.#prepareToolCheckRoll(roll);
      default: return null;
    }
  }

  #prepareAttackRoll(roll) {
    return constructRollFormula({ actor: this.actor, formula: roll.formula });
  }

  #prepareDamageRoll(roll) {
    return constructRollFormula({ actor: this.actor, formula: roll.formula });
  }

  #prepareGenericRoll(roll) {
    return constructRollFormula({ actor: this.actor, formula: roll.formula });
  }

  #prepareHealingRoll(roll) {
    return constructRollFormula({ actor: this.actor, formula: roll.formula });
  }

  #prepareToolCheckRoll(roll) {
    console.log(roll);

    const modifiers = [];

    // Check if ability configured
    const abilityKey = roll.ability === 'none' ? null : roll.ability;
    if (abilityKey) {
      modifiers.push({
        label: localize('A5E.AbilityCheckMod', {
          ability: localize(CONFIG.A5E.abilities[abilityKey])
        }),
        value: this.actor.system.abilities[abilityKey]?.check.mod
      });
    }

    // Check tool prof
    const isProficient = this.actor.system.proficiencies?.tools?.includes(roll.tool);
    if (isProficient) {
      modifiers.push({
        label: localize('A5E.Proficiency'),
        value: this.actor.system.attributes.prof
      });
    }

    // Add Global Ability bonus
    modifiers.push({
      label: localize('A5E.AbilityCheckBonusGlobal'),
      value: this.actor.system.bonuses.abilities.check
    });

    return constructD20RollFormula({ actor: this.actor, modifiers });
  }

  async shareItemDescription() {
    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          cardType: 'item',
          description: this.system.description,
          img: this.img,
          name: this.name
        }
      },
      content: '<article></article>'
    };

    ChatMessage.create(chatData);
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
